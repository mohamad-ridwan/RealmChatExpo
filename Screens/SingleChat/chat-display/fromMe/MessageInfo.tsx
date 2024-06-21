import { View, Text } from 'react-native'
import React from 'react'
import moment from 'moment'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

type Props = {
    v: any
}

export default function MessageInfo({
    v
}: Props) {
  return (
    <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 3
    }}>
        <Text
            style={{
                textAlign: "right",
                fontSize: 8,
                color: "#6B7C85",
            }}
        >
            {/* {format(v.message.messageTimestamp * 1000)} */}
            {moment(v.message.messageTimestamp).format(
                "YYYY-MM-DD hh:mm:ss"
            )}
        </Text>
        <Text>
            {v.status === 0 ?
                <Ionicons name="checkmark" color="#6B7C85" />
                : v.status === 1 ?
                    <Ionicons name="checkmark-done" color="#6B7C85" />
                    :
                    v.status === 2 ?
                        <Ionicons name="checkmark-done" color="#0087D2" />
                        :
                        <MaterialCommunityIcons name="clock-time-eight-outline" color="#6B7C85" />
            }
        </Text>
    </View>
  )
}