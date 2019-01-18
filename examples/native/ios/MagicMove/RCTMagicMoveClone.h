//
//  RCTMagicMoveClone.h
//  react-native-magic-move
//
//  Created by Hein Rutjes on 16/01/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#ifndef RCTMagicMoveClone_h
#define RCTMagicMoveClone_h

#import <React/RCTComponent.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTResizeMode.h>

#import "RCTMagicMoveCloneDataManager.h"

@class RCTEventDispatcher;
@interface RCTMagicMoveClone : UIView

@property (nonatomic, assign) NSString* id;
@property (nonatomic, assign) BOOL isScene;
@property (nonatomic, assign) BOOL isTarget;
@property (nonatomic, assign) CGFloat blurRadius;
@property (nonatomic, assign) RCTResizeMode resizeMode;

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher dataManager:(RCTMagicMoveCloneDataManager*)dataManager;

- (void) setData:(RCTMagicMoveCloneData*) data;
- (void) updateFrame;

@end

#endif /* RCTMagicMoveClone_h */
