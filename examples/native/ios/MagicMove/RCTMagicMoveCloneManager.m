//
//  RCTMagicMoveCloneManager.m
//  react-native-magic-move
//
//  Created by Hein Rutjes on 16/01/2019.
//

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTShadowView.h>

#import "RCTMagicMoveCloneManager.h"
#import "RCTMagicMoveClone.h"
#import "RCTMagicMoveCloneDataManager.h"

@implementation RCTMagicMoveCloneManager
{
  RCTMagicMoveCloneDataManager* _dataManager;
}

RCT_EXPORT_MODULE();

- (instancetype) init
{
  if ((self = [super init])) {
    _dataManager = [[RCTMagicMoveCloneDataManager alloc]init];
  }
  return self;
}

- (UIView *)view
{
  return [[RCTMagicMoveClone alloc] initWithDataManager:_dataManager];
}

- (dispatch_queue_t)methodQueue
{
  return self.bridge.uiManager.methodQueue;
}

RCT_EXPORT_VIEW_PROPERTY(id, NSString);
RCT_EXPORT_VIEW_PROPERTY(isScene, BOOL);
RCT_EXPORT_VIEW_PROPERTY(isTarget, BOOL);
RCT_EXPORT_VIEW_PROPERTY(blurRadius, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(contentTransform, CATransform3D);

RCT_REMAP_METHOD(init,
                 options:(NSDictionary *)options
                 reactTag:(nonnull NSNumber *)reactTag
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  // Destructure options
  NSString* sharedId = options[@"id"];
  BOOL isScene = [options[@"isScene"] boolValue];
  BOOL isTarget = [options[@"isTarget"] boolValue];
  BOOL debug = [options[@"debug"] boolValue];
  NSNumber* sourceTag = options[@"source"];
  NSNumber* parentTag = options[@"parent"];
  MMSnapshotType snapshotType = [options[@"snapshotType"] intValue];
  
  // Get shadow views
  RCTShadowView* sourceShadowView = [self.bridge.uiManager shadowViewForReactTag:sourceTag];
  RCTShadowView* parentShadowView = [self.bridge.uiManager shadowViewForReactTag:parentTag];
  
  // Ref to data manager
  RCTMagicMoveCloneDataManager* dataManager = _dataManager;
  
  // Calculate layout
  void (^__block calculateLayout)(void) = ^{
    CGRect layout = [sourceShadowView measureLayoutRelativeToAncestor:parentShadowView];
    
    // If the layout is not yet available, try again in a bit
    if (!(layout.size.width * layout.size.height)) {
      dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(4 * NSEC_PER_MSEC));
      dispatch_after(popTime, self.bridge.uiManager.methodQueue, calculateLayout);
      return;
    }
    
    // Prepare result
    NSMutableDictionary* result = [[NSMutableDictionary alloc]init];
    [result setObject:@(layout.size.width) forKey:@"width"];
    [result setObject:@(layout.size.height) forKey:@"height"];
    [result setObject:@(layout.origin.x) forKey:@"x"];
    [result setObject:@(layout.origin.y) forKey:@"y"];
    
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
      
      // Get source image
      UIImage *image = nil;
      if (snapshotType != MMSnapshotTypeNone) {
        if ((snapshotType == MMSnapshotTypeRawImage) && [sourceView isKindOfClass:[UIImageView class]]) {
          UIImageView* sourceImageView = (UIImageView*) sourceView;
          image = sourceImageView.image;
          [result setObject:@(image.size.width / image.size.height) forKey:@"imageAspectRatio"];
        }
        else {
          CGRect bounds = layout;
          bounds.origin.x = 0;
          bounds.origin.y = 0;
          UIGraphicsBeginImageContextWithOptions(layout.size, isScene, 0.0f);
          [sourceView drawViewHierarchyInRect:bounds afterScreenUpdates:NO];
          image = UIGraphicsGetImageFromCurrentImageContext();
          UIGraphicsEndImageContext();
        }
      }
      
      // Upon success, send notification with the result
      resolve(result);
      
      // Create data object
      RCTMagicMoveCloneData* data = [[RCTMagicMoveCloneData alloc]init:sharedId reactTag:sourceTag layout:layout snapshotType:snapshotType image:image isScene:isScene isTarget:isTarget debug:debug];
      [dataManager put:data];
      [view setData:data];
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
