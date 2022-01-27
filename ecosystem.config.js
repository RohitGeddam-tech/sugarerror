module.exports = {                                                                                                   
	apps : [
		{
			name          : 'sugarlogger-frontend',
			script        : 'npm',
			interpreter   : 'none',
			args          : 'start',
			env_production : {
				NODE_ENV: 'production'
			}
		}
	]                                                                                                               
}; 
