//
//  RCTMagicMoveClone.m
//  react-native-magic-move
//
//  Created by Hein Rutjes on 16/01/2019.
//

#import <Foundation/Foundation.h>

#import <React/RCTConvert.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/UIView+React.h>

#import "RCTMagicMoveClone.h"
#import "RCTMagicMoveCloneDataManager.h"

#ifdef DEBUG
#define DebugLog(...) NSLog(__VA_ARGS__)
#else
#define DebugLog(...) (void)0
#endif

@implementation RCTMagicMoveClone
{
  RCTEventDispatcher* _eventDispatcher;
  RCTMagicMoveCloneDataManager* _dataManager;
  RCTMagicMoveCloneData* _data;
  UIImageView* _imageView;
  BOOL _needsReload;
}

@synthesize id = _id;
@synthesize isScene = _isScene;
@synthesize isTarget = _isTarget;
@synthesize offsetX = _offsetX;
@synthesize offsetY = _offsetY;

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher dataManager:(RCTMagicMoveCloneDataManager*)dataManager
{
  if ((self = [super init])) {
    _eventDispatcher = eventDispatcher;
    _dataManager = dataManager;
    _data = nil;
    _id = nil;
    _offsetX = 0.0f;
    _offsetY = 0.0f;
    _isScene = false;
    _isTarget = false;
    _needsReload = NO;
    _imageView = nil;
    self.userInteractionEnabled = NO; // Pointer-events = 'none'
  }
  
  return self;
}

- (void)dealloc
{
  if (_data != nil) {
    [_dataManager release:_data];
    _data = nil;
  }
}

- (void)reactSetFrame:(CGRect)frame
{
  if (frame.size.width * frame.size.height) {
    [super reactSetFrame:frame];
  }
}

/*
- (void)displayLayer:(CALayer *)layer
{
  if (CGSizeEqualToSize(layer.bounds.size, CGSizeZero)) {
    return;
  }
  
  if (_isScene) {
    layer.backgroundColor = [[UIColor colorWithRed:0.0f green:1.0f blue:0.0f alpha:0.2f] CGColor];
  }
  else if (_isTarget) {
    layer.backgroundColor = [[UIColor colorWithRed:1.0f green:0.0f blue:0.0f alpha:0.5f] CGColor];
  }
  else {
    //layer.backgroundColor = [[UIColor colorWithRed:0.0f green:0.0f blue:1.0f alpha:0.5f] CGColor];
    layer.backgroundColor = [[UIColor purpleColor] CGColor];
  }
}*/

- (void) setData:(RCTMagicMoveCloneData*) data
{
  // DebugLog(@"setSource: view.frame: %@, parent.frame: %@", NSStringFromCGRect(source.frame), NSStringFromCGRect(parent.frame));
  _data = data;
  
  // Add/update UIImageView
  if (data.image != nil) {
    CGRect bounds = data.layout;
    bounds.origin.x = 0;
    bounds.origin.y = 0;
    if (!_imageView) {
      _imageView = [[UIImageView new]initWithImage:data.image];
      _imageView.frame = bounds;
      [self addSubview:_imageView];
    } else {
      _imageView.frame = bounds;
      _imageView.image = data.image;
    }
  }
}

- (void) updateFrame
{
  // Update frame and redraw
  [super reactSetFrame:_data.layout];
  [self.layer setNeedsDisplay];
}

- (void)setBlurRadius:(CGFloat)blurRadius
{
  if (blurRadius != _blurRadius) {
    _blurRadius = blurRadius;
    _needsReload = YES;
  }
  
  // image = RCTBlurredImageWithRadius(image, 4.0f);
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
  if ((_data == nil) && (_id != nil)) {
    NSString* key = [RCTMagicMoveCloneData keyForSharedId:_id isScene:_isScene isTarget:_isTarget];
    RCTMagicMoveCloneData* data = [_dataManager acquire:key];
    if (data != nil) {
      [self setData:data];
      [self.layer setNeedsDisplay];
    }
  }
}

@end
