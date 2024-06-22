import { Text, View } from 'react-native'
import React from 'react'
import moment from 'moment'

type Props = {
    v: any
}

export default function MessageInfo({
    v
}: Props) {
    return (
        <View>
            {v.message?.documentMessage?.caption &&
                <Text style={{fontSize: 9, paddingTop: 5, paddingHorizontal: 5, marginBottom: -13}}>
                    {v.message.documentMessage.caption}
                </Text>
            }
            <View style={{
                justifyContent: 'flex-end',
                flexDirection: 'row'
            }}>
                <Text style={{ fontSize: 9, color: "black" }}>
                    {/* {format(v.message.messageTimestamp * 1000)} */}
                    {moment(v.message.messageTimestamp).format(
                        "YYYY-MM-DD hh:mm:ss"
                    )}
                </Text>
            </View>
        </View>
    )
}