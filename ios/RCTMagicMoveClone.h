//
//  RCTMagicMoveClone.h
//  react-native-magic-move
//
//  Created by Hein Rutjes on 16/01/2019.
//

#ifndef RCTMagicMoveClone_h
#define RCTMagicMoveClone_h

#import <React/RCTView.h>
#import <UIKit/UIKit.h>
#import "RCTMagicMoveCloneDataManager.h"

@interface RCTMagicMoveClone : RCTView

@property (nonatomic, assign) NSString* id;
@property (nonatomic, assign) MMOptions options;
@property (nonatomic, assign) MMContentType contentType;
@property (nonatomic, assign) CGFloat blurRadius;

- (instancetype)initWithDataManager:(RCTMagicMoveCloneDataManager*)dataManager;

- (void) setInitialData:(RCTMagicMoveCloneData*)data contentType:(MMContentType)contentType;

@end

#endif /* RCTMagicMoveClone_h */
