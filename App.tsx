import { useEffect } from "react";
import { Text, View, Button } from "react-native";
import notifee, {
  AndroidImportance,
  EventType,
  TimestampTrigger,
  TriggerType,
} from "@notifee/react-native";

import { styles } from "./styles";

export default function App() {
  async function createChannelId() {
    const channelId = await notifee.createChannel({
      id: "test",
      name: "sales",
      vibration: true,
      importance: AndroidImportance.HIGH,
      /* 
        Esse nível de importância da notificação considera vários fatores como porcentagem da bateria, economia de energia e etc
      */
    });

    return channelId;
  }

  // Para criar e disparar a notificação
  async function displayNotification() {
    await notifee.requestPermission();

    const channelId = await createChannelId();

    // Para disparar a notificação
    await notifee.displayNotification({
      id: "2",
      title: "Olá, <strong>Erikkkkkkk</strong>!",
      body: "Essa é minha primeira <span style='color:red;'>notificação</span>.",
      android: { channelId },
    });
  }

  // Para atualizar uma notificação, basta enviar uma nova utilizando o mesmo id
  // Dessa forma uma nova notificação não será adiciona, mas sim atualizada
  async function updateNotification() {
    await notifee.requestPermission();

    const channelId = await createChannelId();

    await notifee.displayNotification({
      id: "2",
      title: "Olá, <strong>Erik</strong>!",
      body: "Essa é minha primeira <span style='color:red;'>notificação</span>.",
      android: { channelId },
    });
  }

  // Para cancelar uma notificação
  async function cancelNotification() {
    await notifee.cancelNotification("gB0zEWGmNpTO6O5Opnml"); // id da notificação
  }

  // Agendar uma notificação
  async function scheduleNotification() {
    const date = new Date(Date.now());
    date.setMinutes(date.getMinutes() + 1);

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

    const channelId = await createChannelId();

    await notifee.createTriggerNotification(
      {
        title: "Notificação agendada ⏱️",
        body: "Essa é uma notificação agendada",
        android: { channelId },
      },
      trigger
    );
  }

  // Visualizar as notificações agendadas
  async function lisScheduleNotification() {
    const ids = await notifee.getTriggerNotificationIds();

    console.log(ids);
  }

  // Notificação sendo aberta em primeiro plano
  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        // Descarte da notificação
        case EventType.DISMISSED:
          console.log("Usuário descartou a notificação");
          break;
        // Usuário tocou na notificação
        case EventType.PRESS:
          console.log(
            "Usuário tocou na notificação",
            JSON.stringify(detail.notification, null, 2)
          );
          break;
        default:
          console.log("TYPE = ", type);
          break;
      }
    });
  }, []);

  // Notificação sendo aberta em segundo plano
  useEffect(() => {
    return notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log(
          "Usuário tocou na notificação",
          JSON.stringify(detail.notification, null, 2)
        );
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Local Notifications</Text>

      <Button title="Enviar Notificação" onPress={displayNotification} />
      <Button title="Atualizar Notificação" onPress={updateNotification} />
      <Button title="Cancelar Notificação" onPress={cancelNotification} />
      <Button title="Agendar Notificação" onPress={scheduleNotification} />
      <Button
        title="Notificações Agendadas"
        onPress={lisScheduleNotification}
      />
    </View>
  );
}
