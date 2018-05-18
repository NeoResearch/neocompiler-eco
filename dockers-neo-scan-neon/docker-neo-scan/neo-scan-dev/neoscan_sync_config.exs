use Mix.Config

config :neoscan_sync, ecto_repos: []

config :logger, :console,
  format: "$date $time $metadata[$level] [$node] $message\n",
  metadata: [:request_id]

config :neoscan_sync, notification_seeds: [
  System.get_env("NEO_PYTHON_SEED_1"),
]

config :neoscan_sync, start_notifications: 0 #Block height to start notifications check
