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

NSString *StringFromCATransform3D(CATransform3D transform) {
  return [NSString stringWithFormat:@"[%f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f]",
          transform.m11, transform.m12, transform.m13, transform.m14,
          transform.m21, transform.m22, transform.m23, transform.m24,
          transform.m31, transform.m32, transform.m33, transform.m34,
          transform.m41, transform.m42, transform.m43, transform.m44];
}

@implementation RCTMagicMoveClone
{
  RCTMagicMoveCloneDataManager* _dataManager;
  CALayer* _contentLayer;
  CATransform3D _contentTransform;
  UIVisualEffectView* _blurEffectView;
}

@synthesize data = _data;
@synthesize id = _id;
@synthesize isScene = _isScene;
@synthesize isTarget = _isTarget;

- (instancetype)initWithDataManager:(RCTMagicMoveCloneDataManager*)dataManager
{
  if ((self = [super init])) {
    _dataManager = dataManager;
    _data = nil;
    _contentLayer = [[CALayer alloc]init];
    _contentTransform = CATransform3DIdentity;
    [self.layer addSublayer:_contentLayer];
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
  _contentLayer.frame = CGRectMake(0, 0, _data.layout.size.width, _data.layout.size.height);
  _contentLayer.transform = _contentTransform;
  _contentLayer.contents = _data.image ? (id)_data.image.CGImage : nil;
}

- (void) reactSetFrame:(CGRect)frame
{
  // This ensures that the initial clone is visible before it has
  // received any styles from the JS side
  if (frame.size.width * frame.size.height) {
    [super reactSetFrame:frame];
  }
}

- (void) setData:(RCTMagicMoveCloneData*) data
{
  _data = data;
  // (data.isTarget) self.layer.opacity = 0; // TODO
  _contentLayer.frame = CGRectMake(0, 0, data.layout.size.width, data.layout.size.height);
  _contentLayer.contents = _data.image ? (id)_data.image.CGImage : nil;
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

- (void) setContentTransform:(CATransform3D)contentTransform
{
  // DebugLog(@"[MagicMove] setContentTransform: %@", StringFromCATransform3D(contentTransform));
  if (!CATransform3DEqualToTransform(_contentTransform, contentTransform)) {
    _contentTransform = contentTransform;
    if (_data != nil) {
      [self.layer setNeedsDisplay];
    }
  }
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
  // DebugLog(@"[MagicMove] didSetProps (%@ %@): cw: %f, ch: %f, hasData: %@", _isTarget ? @"target" : @"source", _isScene ?@"scene" : @"comp", _contentWidth, _contentHeight, (_data != nil) ? @"Yes" : @"No");
  if ((_data == nil) && (_id != nil)) {
    NSString* key = [RCTMagicMoveCloneData keyForSharedId:_id isScene:_isScene isTarget:_isTarget];
    _data = [_dataManager acquire:key];
    _contentLayer.frame = CGRectMake(0, 0, _data.layout.size.width, _data.layout.size.height);
    _contentLayer.contents = _data.image ? (id)_data.image.CGImage : nil;
    [self.layer setNeedsDisplay];
    //if (_data.isTarget && self.alpha) {self.layer.opacity = 0;
  }
}

@end
