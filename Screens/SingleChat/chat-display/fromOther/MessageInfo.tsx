import { Text } from 'react-native'
import React from 'react'
import moment from 'moment'

type Props = {
    v: any
}

export default function MessageInfo({
    v
}: Props) {
    return (
        <Text style={{ fontSize: 8, color: "black" }}>
            {/* {format(v.message.messageTimestamp * 1000)} */}
            {moment(v.message.messageTimestamp).format(
                "YYYY-MM-DD hh:mm:ss"
            )}
        </Text>
    )
}