import { supabaseClient } from "./supabase-client";

/**
 * 广播通道，用于广播数据. 不会广播给自己发
 * channel name 随意
 */
export const broadcast = supabaseClient.channel("broadcast").subscribe();
