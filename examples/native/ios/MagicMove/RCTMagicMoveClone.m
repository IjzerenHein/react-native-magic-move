//
//  RCTMagicMoveClone.m
//  react-native-magic-move
//
//  Created by Hein Rutjes on 16/01/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <React/RCTConvert.h>
#import "RCTMagicMoveClone.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/UIView+React.h>

#ifdef DEBUG
#define DebugLog(...) NSLog(__VA_ARGS__)
#else
#define DebugLog(...) (void)0
#endif

@implementation RCTMagicMoveClone
{
  RCTEventDispatcher *_eventDispatcher;
  NSString* _id;
  BOOL _debug;
  UIView *_sourceView;
  CGRect _layout;
  BOOL _isTarget;
  BOOL _isScene;
  
  UIImage* _image;
  UIImageView* _imageView;
  BOOL _needsReload;
}

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher
{
  if ((self = [super init])) {
    _eventDispatcher = eventDispatcher;
    _id = nil;
    _debug = NO;
    _sourceView = nil;
    _isTarget = NO;
    _isScene = NO;
    _needsReload = NO;
    _image = nil;
    _imageView = nil;
    // self.contentMode = UIViewContentModeScaleToFill; // resizeMode = 'stretch'
    self.userInteractionEnabled = NO; // Pointer-events = 'none'
  }
  
  return self;
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

- (void) setInitialProps:(NSString*) id sourceView:(UIView*)sourceView layout:(CGRect)layout isScene:(BOOL)isScene isTarget:(BOOL)isTarget debug:(BOOL)debug
{
  // DebugLog(@"setSource: view.frame: %@, parent.frame: %@", NSStringFromCGRect(source.frame), NSStringFromCGRect(parent.frame));
  _id = id;
  _sourceView = sourceView;
  _layout = layout;
  _isScene = isScene;
  _isTarget = isTarget;
  _debug = debug;
  
  [self reloadImage];
  
  // Update frame and redraw
  [super reactSetFrame:layout];
  [self.layer setNeedsDisplay];
}

- (void)setBlurRadius:(CGFloat)blurRadius
{
  if (blurRadius != _blurRadius) {
    _blurRadius = blurRadius;
    _needsReload = YES;
  }
}

- (void) reloadImage
{
  if (_isScene) return;

  // Get bounds
  CGRect bounds = _layout;
  bounds.origin.x = 0;
  bounds.origin.y = 0;
  
  // Get source image
  UIImage *image;
  /*if ([_sourceView isKindOfClass:[UIImageView class]]) {
    UIImageView* sourceImageView = (UIImageView*) _sourceView;
    image = sourceImageView.image;
  }
  else {*/
    UIGraphicsBeginImageContextWithOptions(_layout.size, _isScene, 0.0f);
    [_sourceView drawViewHierarchyInRect:bounds afterScreenUpdates:NO];
    image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
  //}
  
  // image = RCTBlurredImageWithRadius(image, 4.0f);
  
  // Add/update UIImageView
  _image = image;
  if (!_imageView) {
    _imageView = [[UIImageView new]initWithImage:image];
    _imageView.frame = bounds;
    [self addSubview:_imageView];
  } else {
    _imageView.frame = bounds;
    _imageView.image = image;
  }
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
  if (_needsReload) {
    [self reloadImage];
  }
}

@end
