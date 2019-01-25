//
//  RCTMagicMoveCloneData.h
//  react-native-magic-move
//
//  Created by Hein Rutjes on 18/01/2019.
//

#ifndef RCTMagicMoveCloneData_h
#define RCTMagicMoveCloneData_h

typedef NS_ENUM(NSInteger, MMOptions) {
  MMOptionInitial = 1,
  MMOptionScene = 2,
  MMOptionTarget = 4,
  MMOptionVisible = 8,
  MMOptionRawImage = 16,
  MMOptionDebug = 32,
};

@interface RCTMagicMoveCloneData : NSObject

@property (readonly, nonatomic) NSString* sharedId;
@property (readonly, nonatomic) NSString* key;
@property (readonly, nonatomic) NSNumber* reactTag;
@property (readonly, nonatomic) UIImage* snapshotImage;
@property (readonly, nonatomic) UIImage* rawImage;
@property (readonly, nonatomic) CGRect layout;
@property (readonly, nonatomic) MMOptions options;
@property (nonatomic) long refCount;

- (instancetype)init:(NSString*)sharedId reactTag:(NSNumber *)reactTag layout:(CGRect)layout options:(MMOptions)options snapshotImage:(UIImage*) snapshotImage rawImage:(UIImage*) rawImage;

+ (NSString*) keyForSharedId:(NSString*)sharedId options:(MMOptions)options;

@end


#endif /* RCTMagicMoveCloneData_h */
