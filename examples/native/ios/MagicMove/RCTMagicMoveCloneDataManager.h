//
//  RCTMagicMoveCloneDataManager.h
//  wixNavigation
//
//  Created by Hein Rutjes on 18/01/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#ifndef RCTMagicMoveCloneDataManager_h
#define RCTMagicMoveCloneDataManager_h

#import "RCTMagicMoveCloneData.h"

@interface RCTMagicMoveCloneDataManager : NSObject

- (instancetype)init;

- (RCTMagicMoveCloneData*) acquire:(NSString*) key;
- (long) release:(RCTMagicMoveCloneData*) cache;
- (void) put:(RCTMagicMoveCloneData*) cache;

@end


#endif /* RCTMagicMoveCloneDataManager_h */
