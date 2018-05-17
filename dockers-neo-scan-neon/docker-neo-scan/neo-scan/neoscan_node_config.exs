use Mix.Config

config :neoscan_node,
notification_seeds: [
    System.get_env("NEO_PYTHON_SEED_1")
]

config :neoscan_sync, start_notifications: 1 #Block height to start notifications check


config :neoscan_node,
  seeds: [
      System.get_env("NEO_SEED_1"),
      System.get_env("NEO_SEED_2"),
      System.get_env("NEO_SEED_3"),
      System.get_env("NEO_SEED_4")
]

if Mix.env() == :test do
  config :neoscan_node,
    seeds: [
      System.get_env("NEO_SEED_1"),
      System.get_env("NEO_SEED_2"),
      System.get_env("NEO_SEED_3"),
      System.get_env("NEO_SEED_4")
    ]
end
