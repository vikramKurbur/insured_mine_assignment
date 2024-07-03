import os from 'os-utils';
import { exec } from 'child_process';

const startMonitoring = () => {
    setInterval(() => {
        os.cpuUsage((v) => {
            if (v > 0.7) {
                console.log('CPU usage over 70%. Restarting server...');
                exec('pm2 restart my-app', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error restarting server: ${error.message}`);
                        return;
                    }
                    console.log(`Server restart stdout: ${stdout}`);
                    console.log(`Server restart stderr: ${stderr}`);
                });
            }
        });
    }, 5000);
};

export default { startMonitoring };
