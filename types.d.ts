declare module 'react-native-magic-move' {
  import { StyleProp, ViewProps, ViewStyle } from 'react-native'

  // MagicMove Scene
  interface SceneProps extends ViewProps {
    children: any
    id?: string
    disabled?: bool
    active?: bool
    debug?: bool
    useNativeClone?: bool
    mmContext?: any
    onWillAppear?: () => void
    onWillDisappear?: () => void
  }
  const Scene: React.ComponentClass<SceneProps>

  // MagicMove View
  interface ImageSizeHint {
    width: number
    height: number
  }
  interface Axis {
    x: number
    y: number
  }
  interface MagicMoveView extends ViewProps {
    Component?: any
    ComponentType?: string
    AnimatedComponent?: any
    id: string
    useNativeDriver?: bool
    keepHidden?: bool
    duration?: number
    delay?: number
    easing?: func
    debug?: bool
    disabled?: bool
    transition?: () => void
    zIndex?: number
    useNativeClone?: bool
    imageSizeHint?: ImageSizeHint
    parentScaleHint?: number | Axis
    mmContext?: any
  }

  const View: React.ComponentClass<MagicMoveView>

  // MagicMove Transition
  interface MagicMoveTransition {
    move: () => any[]
    morph: () => any[]
    flip: { x: () => void; y: () => void }
    dissolve: () => any[]
    shrinkAndGrow: () => any[]
    squashAndStretch: () => any[]
    scale: () => any[]
  }

  const Transition: MagicMoveTransition

  // MagicMove Provider
  interface MagicMoveProvider {
    debug?: boolean
  }

  const Provider: React.ComponentClass<MagicMoveProvider>

  export const MagicMove = {
    Provider,
    Scene,
    Transition,
    View,
  }
}
