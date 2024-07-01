import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import React, { useRef } from 'react'
import { TouchableNativeFeedback } from 'react-native';
import Caption from '../Caption';

type Props = {
    images: any
    onPress: () => void
    onCaption: boolean
}

export default function ImageViewerType({
    images,
    onPress,
    onCaption
}: Props) {
    const imageZoomRef = useRef<any>(null)
    return (
        <>
            <TouchableNativeFeedback
                style={{ height: '100%', width: '100%' }}
                onPress={onPress}
            >
                <ImageZoom
                    uri={images.url}
                    ref={imageZoomRef}
                    minScale={0.5}
                    maxScale={3}
                    doubleTapScale={5}
                    minPanPointers={3}
                    isPinchEnabled={true}
                    isPanEnabled={true}
                    isSingleTapEnabled
                    isDoubleTapEnabled
                    resizeMode="contain"
                />
            </TouchableNativeFeedback>
            {onCaption && <Caption />}
        </>
    )
}