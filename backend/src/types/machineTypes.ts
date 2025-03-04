export interface Machine {
  machine_id?: string | null;      // Unique identifier for the machine (e.g., conveyor ID)
  timestamp?: string | null;       // Last update time (ISO string or Unix timestamp)
  total_count?: number | null;     // Total number of pages processed
  pages_last_hour?: number | null; // Pages counted in the last hour
  uptime?: number | null;          // Total operating time in seconds
  no_detection?: boolean | null;   // TRUE if the machine is stopped, FALSE if it's running
}
