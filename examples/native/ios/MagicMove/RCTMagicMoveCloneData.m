//
//  RCTMagicMoveCloneData.m
//  wixNavigation
//
//  Created by Hein Rutjes on 18/01/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RCTMagicMoveCloneData.h"

@implementation RCTMagicMoveCloneData

@synthesize sharedId = _sharedId;
@synthesize reactTag = _reactTag;
@synthesize layout = _layout;
@synthesize snapshotType = _snapshotType;
@synthesize image = _image;
@synthesize isScene = _isScene;
@synthesize isTarget = _isTarget;
@synthesize debug = _debug;
@synthesize refCount = _refCount;

- (instancetype)init:(NSString*)sharedId reactTag:(NSNumber *)reactTag layout:(CGRect)layout snapshotType:(MMSnapshotType)snapshotType image:(UIImage*) image isScene:(BOOL)isScene isTarget:(BOOL)isTarget debug:(BOOL)debug
{
  _sharedId = sharedId;
  _reactTag = reactTag;
  _layout = layout;
  _snapshotType = snapshotType;
  _image = image;
  _isScene = isScene;
  _isTarget = isTarget;
  _debug = debug;
  _refCount = 1;
  return self;
}

- (NSString*) key
{
  return [RCTMagicMoveCloneData keyForSharedId:_sharedId isScene:_isScene isTarget:_isTarget];
}

+ (NSString*) keyForSharedId:(NSString*)sharedId isScene:(BOOL)isScene isTarget:(BOOL)isTarget
{
  NSString* type;
  if (isScene) {
    type = isTarget ? @"TargetScene" : @"SourceScene";
  }
  else {
    type = isTarget ? @"TargetComponent" : @"SourceComponent";
  }
  return [NSString stringWithFormat:@"%@:%@", type, sharedId];
}

@end
