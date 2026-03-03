// api/asset-logs/hook.ts
import { useCallback, useEffect, useState } from "react";
import { assetLogsService } from "./service";
import type { AssetLogGroup, AssetLogItem } from "./types";

type UseAssetLogsOptions = {
  group?: AssetLogGroup; // default "all"
  take?: number;         // optional pagination
  skip?: number;
  autoFetch?: boolean;   // default true
};

export const useAssetLogs = (options?: UseAssetLogsOptions) => {
  const group = options?.group ?? "all";
  const take = options?.take;
  const skip = options?.skip;
  const autoFetch = options?.autoFetch ?? true;

  const [logs, setLogs] = useState<AssetLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { take, skip };

      const data =
        group === "all"
          ? await assetLogsService.getAll(params)
          : await assetLogsService.getByGroup(group as Exclude<AssetLogGroup, "all">, params);

      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch asset logs", err);
      setError(err instanceof Error ? err.message : "Failed to load asset logs");
    } finally {
      setLoading(false);
    }
  }, [group, take, skip]);

  useEffect(() => {
    if (autoFetch) fetchLogs();
  }, [autoFetch, fetchLogs]);

  return {
    logs,
    loading,
    error,
    fetchLogs,
    setLogs, // optional
  };
};