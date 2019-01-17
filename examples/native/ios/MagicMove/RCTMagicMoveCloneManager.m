//
//  RCTMagicMoveCloneManager.m
//  react-native-magic-move
//
//  Created by Hein Rutjes on 16/01/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RCTMagicMoveCloneManager.h"
#import "RCTMagicMoveClone.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTShadowView.h>

@implementation RCTMagicMoveCloneManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
  return [[RCTMagicMoveClone alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

- (dispatch_queue_t)methodQueue
{
  return self.bridge.uiManager.methodQueue;
}

RCT_REMAP_METHOD(init,
                 options:(NSDictionary *)options
                 reactTag:(nonnull NSNumber *)reactTag
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  // Destructure options
  NSString* id = options[@"id"];
  BOOL isScene = [options[@"isScene"] boolValue];
  BOOL isTarget = [options[@"isTarget"] boolValue];
  BOOL debug = [options[@"debug"] boolValue];
  NSNumber* sourceTag = options[@"source"];
  NSNumber* parentTag = options[@"parent"];
  
  // Get shadow views
  RCTShadowView* sourceShadowView = [self.bridge.uiManager shadowViewForReactTag:sourceTag];
  RCTShadowView* parentShadowView = [self.bridge.uiManager shadowViewForReactTag:parentTag];
  
  // Calculate layout
  void (^__block calculateLayout)(void) = ^{
    CGRect layout = [sourceShadowView measureLayoutRelativeToAncestor:parentShadowView];
    
    // If the layout is not yet available, try again in a bit
    if (!(layout.size.width * layout.size.height)) {
      dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(4 * NSEC_PER_MSEC));
      dispatch_after(popTime, self.bridge.uiManager.methodQueue, calculateLayout);
      return;
    }
    
    // Upon success, send notification with the result
    resolve(@{
              @"width": @(layout.size.width),
              @"height": @(layout.size.height),
              @"x": @(layout.origin.x),
              @"y": @(layout.origin.y),
              });
    
    // And inform the clone of the layout and other props
    [self.bridge.uiManager prependUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
      RCTMagicMoveClone *view = (RCTMagicMoveClone*) viewRegistry[reactTag];
      if (![view isKindOfClass:[RCTMagicMoveClone class]]) {
        return RCTLogError(@"[MagicMove] Invalid view returned from registry, expecting RCTMagicMoveClone, got: %@", view);
      }
      UIView *sourceView = viewRegistry[sourceTag];
      if (sourceView == nil) {
        return RCTLogError(@"[MagicMove] Invalid source tag specified, not found in registry: %@", sourceTag);
      }
      [view setInitialProps:id sourceView:sourceView layout:layout isScene:isScene isTarget:isTarget debug:debug];
      calculateLayout = nil;
    }];
  };
  calculateLayout();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
