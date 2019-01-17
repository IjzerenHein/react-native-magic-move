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

@class RCTEventDispatcher;
@interface RCTMagicMoveClone : UIView

@property (nonatomic, assign) CGFloat blurRadius;
@property (nonatomic, assign) RCTResizeMode resizeMode;

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher NS_DESIGNATED_INITIALIZER;

- (void) setInitialProps:(NSString*) id sourceView:(UIView*)sourceView layout:(CGRect)layout isScene:(BOOL)isScene isTarget:(BOOL)isTarget debug:(BOOL)debug;

@end

#endif /* RCTMagicMoveClone_h */
