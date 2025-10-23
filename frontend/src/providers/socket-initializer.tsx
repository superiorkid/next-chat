"use client";

import { useEffect } from "react";
import { useSocketStore } from "./socket-store-provider";

export function SocketInitializer() {
  const connect = useSocketStore((s) => s.connect);

  useEffect(() => {
    connect();
  }, [connect]);

  return null;
}
