const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljemx1bHRwcXRqeXp4dXB6ZGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MTQ5MjgsImV4cCI6MjEwMTA5MDkyOH0.K3mz3zdwKpW3sRcyJ2DcZaHngt-HhdgPbKLg9kJKQjA";

fetch('https://achuwedsappu-api.ajaynn7.workers.dev/api/families/my-family', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(async res => {
  console.log('Status:', res.status);
  console.log('Body:', await res.text());
}).catch(console.error);
