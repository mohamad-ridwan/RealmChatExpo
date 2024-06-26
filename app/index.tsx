import React, { useEffect } from 'react'
import * as Notifications from 'expo-notifications'
import Navigation from '@/Config/Navigation'

export default function Home() {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification?.request?.content?.data?.chatId &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      // THIS RESPONSE WILL BE REDIRECT TO SINGLE CHAT
      console.log('user touch the notification', lastNotificationResponse?.notification?.request?.content?.data?.chatId)
    }
  }, [lastNotificationResponse]);

  return (
    <Navigation />
  )
}