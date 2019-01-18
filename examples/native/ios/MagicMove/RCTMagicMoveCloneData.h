//
//  RCTMagicMoveCloneData.h
//  react-native-magic-move
//
//  Created by Hein Rutjes on 18/01/2019.
//

#ifndef RCTMagicMoveCloneData_h
#define RCTMagicMoveCloneData_h

typedef NS_ENUM(NSInteger, MMSnapshotType) {
  MMSnapshotTypeNone = 0,
  MMSnapshotTypeImage = 1,
  MMSnapshotTypeRawImage = 2,
};

@interface RCTMagicMoveCloneData : NSObject

@property (readonly, nonatomic) NSString* sharedId;
@property (readonly, nonatomic) NSString* key;
@property (readonly, nonatomic) NSNumber* reactTag;
@property (readonly, nonatomic) UIImage* image;
@property (readonly, nonatomic) MMSnapshotType snapshotType;
@property (readonly, nonatomic) CGRect layout;
@property (readonly, nonatomic) BOOL isScene;
@property (readonly, nonatomic) BOOL isTarget;
@property (readonly, nonatomic) BOOL debug;
@property (nonatomic) long refCount;

- (instancetype)init:(NSString*)sharedId reactTag:(NSNumber *)reactTag layout:(CGRect)layout snapshotType:(MMSnapshotType)snapshotType image:(UIImage*) image isScene:(BOOL)isScene isTarget:(BOOL)isTarget debug:(BOOL)debug;

+ (NSString*) keyForSharedId:(NSString*)sharedId isScene:(BOOL)isScene isTarget:(BOOL)isTarget;

@end


#endif /* RCTMagicMoveCloneData_h */
