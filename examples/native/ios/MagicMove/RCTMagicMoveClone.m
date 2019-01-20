//
//  RCTMagicMoveClone.m
//  react-native-magic-move
//
//  Created by Hein Rutjes on 16/01/2019.
//

#import <Foundation/Foundation.h>
#import <React/UIView+React.h>
#import "RCTMagicMoveClone.h"
#import "RCTMagicMoveCloneDataManager.h"
#import "BlurEffectWithAmount.h"

#ifdef DEBUG
#define DebugLog(...) NSLog(__VA_ARGS__)
#else
#define DebugLog(...) (void)0
#endif

@implementation RCTMagicMoveClone
{
  RCTMagicMoveCloneDataManager* _dataManager;
  CALayer* _imageLayer;
  UIVisualEffectView* _blurEffectView;
}

@synthesize data = _data;
@synthesize id = _id;
@synthesize isScene = _isScene;
@synthesize isTarget = _isTarget;
@synthesize contentOffsetX = _contentOffsetX;
@synthesize contentOffsetY = _contentOffsetY;
@synthesize contentWidth = _contentWidth;
@synthesize contentHeight = _contentHeight;

- (instancetype)initWithDataManager:(RCTMagicMoveCloneDataManager*)dataManager
{
  if ((self = [super init])) {
    _dataManager = dataManager;
    _data = nil;
    _imageLayer = [[CALayer alloc]init];
    [self.layer addSublayer:_imageLayer];
    self.userInteractionEnabled = NO; // Pointer-events = 'none'
    self.layer.masksToBounds = YES; // overflow = 'hidden'
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

- (void)displayLayer:(CALayer *)layer
{
  [super displayLayer:layer];
  
  if (_data == nil) return;
  _imageLayer.frame = CGRectMake(_contentOffsetX, _contentOffsetY, _contentWidth, _contentHeight);
  _imageLayer.contents = _data.image ? (id)_data.image.CGImage : nil;
}

- (void) setData:(RCTMagicMoveCloneData*) data
{
  _data = data;
  _contentWidth = data.layout.size.width;
  _contentHeight = data.layout.size.height;
  //if (data.isTarget) self.layer.opacity = YES; // TODO?
  [super reactSetFrame:_data.layout];
  [self.layer setNeedsDisplay];
}

- (void)setBlurRadius:(CGFloat)blurRadius
{
  blurRadius = (blurRadius <=__FLT_EPSILON__) ? 0 : blurRadius;
  if (blurRadius != _blurRadius) {
    _blurRadius = blurRadius;
    // DebugLog(@"[MagicMove] setBlurRadius: %f", blurRadius);
    //[self.layer setNeedsDisplay];
    
    if (blurRadius) {
      BlurEffectWithAmount* blurEffect = [BlurEffectWithAmount effectWithStyle:UIBlurEffectStyleLight andBlurAmount:@(blurRadius)];
      if (_blurEffectView == nil) {
        _blurEffectView = [[UIVisualEffectView alloc] init];
        _blurEffectView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        _blurEffectView.effect = blurEffect;
        _blurEffectView.frame = CGRectMake(0, 0, self.frame.size.width, self.frame.size.height);
        [self addSubview:_blurEffectView];
      }
      else {
        _blurEffectView.effect = blurEffect;
      }
    }
    else if (_blurEffectView) {
      [_blurEffectView removeFromSuperview];
      _blurEffectView = nil;
    }
  }
  
  // image = RCTBlurredImageWithRadius(image, 4.0f);
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
  // DebugLog(@"[MagicMove] didSetProps (%@ %@): cw: %f, ch: %f, hasData: %@", _isTarget ? @"target" : @"source", _isScene ?@"scene" : @"comp", _contentWidth, _contentHeight, (_data != nil) ? @"Yes" : @"No");
  if ((_data == nil) && (_id != nil)) {
    NSString* key = [RCTMagicMoveCloneData keyForSharedId:_id isScene:_isScene isTarget:_isTarget];
    _data = [_dataManager acquire:key];
  }
  [self.layer setNeedsDisplay];
}

@end
