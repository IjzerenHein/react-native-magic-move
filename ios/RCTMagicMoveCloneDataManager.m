//
//  RCTMagicMoveCloneDataManager.m
//  react-native-magic-move
//
//  Created by Hein Rutjes on 18/01/2019.
//

#import <UIKit/UIKit.h>
#import "RCTMagicMoveCloneDataManager.h"

@implementation RCTMagicMoveCloneDataManager
{
  NSMutableDictionary* _items;
}

- (instancetype)init
{
  _items = [[NSMutableDictionary alloc]init];
  return self;
}

- (RCTMagicMoveCloneData*) acquire:(NSString*) key
{
  @synchronized(_items)
  {
    RCTMagicMoveCloneData* item = [_items objectForKey:key];
    if (item != nil) {
      item.refCount = item.refCount + 1;
    }
    return item;
  }
}

- (long) release:(RCTMagicMoveCloneData*) item
{
  @synchronized(_items)
  {
    item.refCount = item.refCount - 1;
    if (item.refCount == 0) {
      [_items removeObjectForKey:item.key];
    }
    return item.refCount;
  }
}

- (void) put:(RCTMagicMoveCloneData*) item
{
  @synchronized(_items)
  {
    [_items setObject:item forKey:item.key];
  }
}

@end
