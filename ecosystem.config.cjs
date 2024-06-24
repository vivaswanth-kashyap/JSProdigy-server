module.exports = {
	apps: [
		{
			name: "prodigy-server",
			script: "app.js",
			env: {
				NODE_ENV: "production",
			},
			instances: 1, // Adjust based on your server capacity
			exec_mode: "cluster",
			watch: false,
			max_memory_restart: "500M",
			env_production: {
				NODE_ENV: "production",
			},
			env_development: {
				NODE_ENV: "development",
			},
		},
	],
};
