import { REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef } from "react";
import { broadcast } from "../supabase/socket";

export default function PageBroadcast() {
  const sendRef = useRef<HTMLInputElement>(null);
  const receiveRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    broadcast.on(
      REALTIME_LISTEN_TYPES.BROADCAST,
      { event: "input" },
      (payload) => {
        if (receiveRef.current && payload.payload?.message) {
          receiveRef.current.value = payload.payload.message;
        }
      }
    );
  }, []);

  const sendInput = useCallback(() => {
    broadcast.send({
      type: REALTIME_LISTEN_TYPES.BROADCAST,
      event: "input",
      payload: {
        message: sendRef.current?.value,
      },
    });
  }, []);

  return (
    <div>
      <h1>Page 2</h1>
      <h3>发送的数据</h3>
      <h3 style={{ display: "flex", gap: "10px" }}>
        <input type="text" placeholder="send data" ref={sendRef} />
        <button onClick={sendInput}>发送</button>
      </h3>
      <h3>接受的数据</h3>
      <input type="text" placeholder="receive data" ref={receiveRef} />
    </div>
  );
}
