require('dotenv').config();
const express = require('express');
const https = require('https');
const app = express();
const axios = require('axios');
const FetchuserdataWithPupeteer = require('./scraper'); // Import the scraper module

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
const  textDataMap = {
"DLcdelwxPOZ":[
  {
     "username": "rox_aadiyan",
      "text": "🔥🔥🔥",
      "profilePic":"https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI4LTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzUyNTY3ODA4MF8xNzg1NDQyMTMwNDQ5NjY2N180MDkzNjMxMTM2ODkyNDM3NTE0X24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZlZmc9ZXlKMlpXNWpiMlJsWDNSaFp5STZJbkJ5YjJacGJHVmZjR2xqTG1ScVlXNW5ieTR4TURnd0xtTXlJbjAmX25jX2h0PXNjb250ZW50LWxocjgtMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTExJl9uY19vYz1RNmNaMlFHNUdEWHN0RFQzN0pfd1Rhd0ZxZ2ZNX0c1T0FPWGxRdEVZSUREeXR6NnhBRnFlc09pWWVueDNHaDBxR0JqYV9LZyZfbmNfb2hjPW8yakFxbFg0aE9rUTdrTnZ3RUNLQ29jJl9uY19naWQ9Z01IS2JGcUlPNUUyVG5GTlJEenJLZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZYaVVLX3M1OGs2TTJvbFlIcEFZVnlXZnI4YTBaLWdTRGtsQWpvSkFIS2lYdyZvZT02ODlCOUUwMyZfbmNfc2lkPWQ2MjE3Ng"
  },
    {
     "username": "teli_teli_00",
      "text": "❤️❤️❤️",
      "profilePic":"https://igrcp.com/instapic/   aHR0cHM6Ly9zY29udGVudC1mY28yLTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ2NDc2MDk5Nl8xMjU0MTQ2ODM5MTE5ODYyXzM2MDUzMjE0NTc3NDI0MzU4MDFfbi5wbmc_c3RwPWRzdC1qcGdfZTBfczE1MHgxNTBfdHQ2JmNiPTg1NzdjNzU0LWMyNDY0OTIzJmVmZz1leUoyWlc1amIyUmxYM1JoWnlJNkluQnliMlpwYkdWZmNHbGpMbVJxWVc1bmJ5NHhOVEF1WXpJaWZRJl9uY19odD1zY29udGVudC1mY28yLTEuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTExMCZfbmNfb2M9UTZjWjJRRXVUWDJuVU1pYy1PSFNEUmdZWEhDQjE4emlMYThybXB5OUFyUjJRUDRLcG4xVWxaWjZoaUV6SnE2bGpvVVIzVU0mX25jX29oYz0yT3ZEbzVqZ2NtY1E3a052d0YxWERhViZfbmNfZ2lkPVhtX2RkaGdiU3VvMHI4MEZvTkFLOHcmZWRtPUFFc1IxcE1CQUFBQSZjY2I9Ny01JmlnX2NhY2hlX2tleT1ZVzV2Ym5sdGIzVnpYM0J5YjJacGJHVmZjR2xqLjMtY2NiNy01LWNiODU3N2M3NTQtYzI0NjQ5MjMmb2g9MDBfQWZYXzhWaFJob2h0SWVkMHR6d2tza1dPMG5iVHJ3NW1lRGtqdGx3YndKd21EUSZvZT02ODlCOTA2OCZfbmNfc2lkPWUyZjg4YQ"
  },
   {
     "username": "faijan_r_a_n_a_315",
      "text": "🇮🇳",
      "profilePic":"https://igrcp.com/instapic/   aHR0cHM6Ly9zY29udGVudC1saHI2LTIuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ1MjI2ODk0M180NzM1MTI3NDIwNzU5MjhfNDY5OTU1MTEyODY3MjAyNjUyN19uLmpwZz9zdHA9ZHN0LWpwZ19zMTUweDE1MF90dDYmZWZnPWV5SjJaVzVqYjJSbFgzUmhaeUk2SW5CeWIyWnBiR1ZmY0dsakxtUnFZVzVuYnk0eE1EZ3dMbU15SW4wJl9uY19odD1zY29udGVudC1saHI2LTIuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTEwMCZfbmNfb2M9UTZjWjJRRzVHRFhzdERUMzdKX3dUYXdGcWdmTV9HNU9BT1hsUXRFWUlERHl0ejZ4QUZxZXNPaVllbngzR2gwcUdCamFfS2cmX25jX29oYz1ibTRlNmxCYnh0OFE3a052d0ZoaW1ySCZfbmNfZ2lkPWdNSEtiRnFJTzVFMlRuRk5SRHpyS2cmZWRtPUFLcDZDYklCQUFBQSZjY2I9Ny01Jm9oPTAwX0FmVi1qUUZfQjlyQl9CMFd4SC1tMmJDSE9zRDR5N3l6Vy1XX05TMEJSTWt6YVEmb2U9Njg5Qjg5MjEmX25jX3NpZD1kNjIxNzY"
  },
  {
     "username": "arif_idrese0101",
      "text": "😇😇😇",
      "profilePic":"https://igrcp.com/instapic/   aHR0cHM6Ly9zY29udGVudC1saHI4LTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzUxNjUyODQzMV8xNzg2ODM2NjEzMjQwNDk0OF83OTg5NTc0MDk0NDUyNDAzMjY0X24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZlZmc9ZXlKMlpXNWpiMlJsWDNSaFp5STZJbkJ5YjJacGJHVmZjR2xqTG1ScVlXNW5ieTR4TURnd0xtTXlJbjAmX25jX2h0PXNjb250ZW50LWxocjgtMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTA4Jl9uY19vYz1RNmNaMlFHNUdEWHN0RFQzN0pfd1Rhd0ZxZ2ZNX0c1T0FPWGxRdEVZSUREeXR6NnhBRnFlc09pWWVueDNHaDBxR0JqYV9LZyZfbmNfb2hjPTFUa21rcVpkS3c0UTdrTnZ3SFU3Q0xKJl9uY19naWQ9Z01IS2JGcUlPNUUyVG5GTlJEenJLZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZWYkZuSmh2cnlFWmRSOFd5M3ZYUXRHVVVNY004dUk2TktoZUNoaWd2eTBGZyZvZT02ODlCNzhFNCZfbmNfc2lkPWQ2MjE3Ng"
  },
   {
     "username": "sonic_____builders",
      "text": "🔥🔥🔥",
      "profilePic":"https://igrcp.com/instapic/   aHR0cHM6Ly9zY29udGVudC1saHI4LTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzUyODcwMjMyM18xNzk3Mjc2OTg0NTkxMzI1MV8zMzQ2MjM4NjY4Mjc3MDM0ODQ3X24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZlZmc9ZXlKMlpXNWpiMlJsWDNSaFp5STZJbkJ5YjJacGJHVmZjR2xqTG1ScVlXNW5ieTR4TURnd0xtTXlJbjAmX25jX2h0PXNjb250ZW50LWxocjgtMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTExJl9uY19vYz1RNmNaMlFHNUdEWHN0RFQzN0pfd1Rhd0ZxZ2ZNX0c1T0FPWGxRdEVZSUREeXR6NnhBRnFlc09pWWVueDNHaDBxR0JqYV9LZyZfbmNfb2hjPWlBWnRVMEtjYWdVUTdrTnZ3SGk2OGstJl9uY19naWQ9Z01IS2JGcUlPNUUyVG5GTlJEenJLZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZXc25KWDBmcVUyWEM0XzNQblZNYWRsekxBemZLQW9DSWR1QXpOR3hTbnJhQSZvZT02ODlCQTE5QSZfbmNfc2lkPWQ2MjE3Ng"
  },
    {
     "username": "thakur_aakash_soam",
      "text": "Super phone",
      "profilePic":"https://scontent-ams2-1.cdninstagram.com/v/t51.2885-19/373249187_2048361328837331_6678591883032176009_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-ams2-1.cdninstagram.com&_nc_cat=111&_nc_oc=Q6cZ2QHwyyHARA6Vx1fVw9s-We_G_cHbIWv5By7bWpY4ebSzqt2_0jGItE9o6PkXO0T5oWU&_nc_ohc=u4FcNZa4uMsQ7kNvwH_Z1e4&_nc_gid=Yf8b6BLIgm83rWg20_yuPw&edm=ANTKIIoBAAAA&ccb=7-5&oh=00_AfUAKtHTlk9fcn7iAQXeFUsWCD38BaM4TSbYUJWVGPTzhA&oe=689B9CF2&_nc_sid=d885a2"
  },
    {
     "username": "its_sakib_khan_5",
      "text": "Bharat mobile❤️ gift",
      "profilePic":"https://scontent-ams4-1.cdninstagram.com/v/t51.2885-19/528638961_17942222418040987_4781086678630710124_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-ams4-1.cdninstagram.com&_nc_cat=107&_nc_oc=Q6cZ2QHwyyHARA6Vx1fVw9s-We_G_cHbIWv5By7bWpY4ebSzqt2_0jGItE9o6PkXO0T5oWU&_nc_ohc=YOn_ctB3hAIQ7kNvwEz1l8n&_nc_gid=Yf8b6BLIgm83rWg20_yuPw&edm=ANTKIIoBAAAA&ccb=7-5&oh=00_AfXwKSslItOCqaWuWao4hqgKKgBijWIqNeljLNxg3qMj6w&oe=689BA52D&_nc_sid=d885a2"
  },
   {
     "username": "mj_javed_kin",
      "text": "❤️❤️❤️ ",
      "profilePic":"https://scontent-ams4-1.cdninstagram.com/v/t51.2885-19/476460259_1134758037906409_229272084461880693_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-ams4-1.cdninstagram.com&_nc_cat=101&_nc_oc=Q6cZ2QHwyyHARA6Vx1fVw9s-We_G_cHbIWv5By7bWpY4ebSzqt2_0jGItE9o6PkXO0T5oWU&_nc_ohc=MXAXajQzys8Q7kNvwEJcauf&_nc_gid=Yf8b6BLIgm83rWg20_yuPw&edm=ANTKIIoBAAAA&ccb=7-5&oh=00_AfVjFrFoAuRA9l519IHyVMd27oMsr5yv_Y21hZ9volpUeA&oe=689B8CFE&_nc_sid=d885a2"
  },
],
"DOljNn_gVLJ":[
  {
    "username": "arshan_malik_0008",
    "profilePic": "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI2LTIuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ0ODg0MjE4XzM0NTcwNzEwMjg4MjUxOV8yNDQ2MDY5NTg5NzM0MzI2MjcyX24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZlZmc9ZXlKMlpXNWpiMlJsWDNSaFp5STZJbkJ5YjJacGJHVmZjR2xqTG1ScVlXNW5ieTR4TlRBdVl6SWlmUSZfbmNfaHQ9c2NvbnRlbnQtbGhyNi0yLmNkbmluc3RhZ3JhbS5jb20mX25jX2NhdD0xJl9uY19vYz1RNmNaMlFIbk5QWTczYTRJbUI1bjh4QmVZdUlnVVY5UGF2N2dBdFRkMjVuTENvYzc5R3ZONlB3eml0b1VxMW1NRFdnWE1MOCZfbmNfb2hjPUFNT2hoLUtDajhVUTdrTnZ3SFJ2aS04Jl9uY19naWQ9ZkdXQ2JsU2xCYzZyZWc5aXU5ZWhoZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmaWdfY2FjaGVfa2V5PVlXNXZibmx0YjNWelgzQnliMlpwYkdWZmNHbGouMy1jY2I3LTUmb2g9MDBfQWZiWUJjeXBIbEo5dHUyb3d0aXQzUm9LQXdUYWZGdWhTaGtFd1UzaEdfOXRNZyZvZT02OEQ0QTU4RiZfbmNfc2lkPWQ2MjE3Ng",
    "text": "❤"
  },
  {
    "username": "samad__ak__315",
    "profilePic": "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI2LTIuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzUyMTk1NDI0MV8xNzg2OTg3NjE0OTQwNDkyOF81ODcyODc4MzA2MzYxODc2OTc5X24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZlZmc9ZXlKMlpXNWpiMlJsWDNSaFp5STZJbkJ5YjJacGJHVmZjR2xqTG1ScVlXNW5ieTR4TURnd0xtTXlJbjAmX25jX2h0PXNjb250ZW50LWxocjYtMi5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTAwJl9uY19vYz1RNmNaMlFIbk5QWTczYTRJbUI1bjh4QmVZdUlnVVY5UGF2N2dBdFRkMjVuTENvYzc5R3ZONlB3eml0b1VxMW1NRFdnWE1MOCZfbmNfb2hjPWlDby1TYWR2SDhVUTdrTnZ3R3ZSRFZWJl9uY19naWQ9ZkdXQ2JsU2xCYzZyZWc5aXU5ZWhoZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZiS09HUkNuUjZweGVYSUhpbjJTTFZvc055dDZzeHFWZFJNMnBqOTV5clRjUSZvZT02OEQ0OTlERSZfbmNfc2lkPWQ2MjE3Ng",
    "text": "📲📲📲📲📲"
  },
  {
    "username": "nafiz__ansari99",
    "profilePic": "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI4LTIuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzUxMzg1NDY3M18xODA3MjQzMDc3NTUwNjgzN18yMDY4Nzc0ODI4Mzk1MTM3MDQ5X24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZlZmc9ZXlKMlpXNWpiMlJsWDNSaFp5STZJbkJ5YjJacGJHVmZjR2xqTG1ScVlXNW5ieTR4TURnd0xtTXlJbjAmX25jX2h0PXNjb250ZW50LWxocjgtMi5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTAxJl9uY19vYz1RNmNaMlFIbk5QWTczYTRJbUI1bjh4QmVZdUlnVVY5UGF2N2dBdFRkMjVuTENvYzc5R3ZONlB3eml0b1VxMW1NRFdnWE1MOCZfbmNfb2hjPUoxeUpINjFza3pZUTdrTnZ3SDB6a0NzJl9uY19naWQ9ZkdXQ2JsU2xCYzZyZWc5aXU5ZWhoZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZhU3VUQmM0TFJrTXRRVkhZSEpUdUYwS1kwRkR4c3pQTjcwZF9GUk1sQThmUSZvZT02OEQ0OUIzMSZfbmNfc2lkPWQ2MjE3Ng",
    "text": "Bharat mobile ❤❤"
  },
  {
    "username": "junaidali7322",
    "profilePic": "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI2LTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzU0NzUxODUxMV8xNzkzNDk5MTUxNTA4NzU2Nl8yNDczOTE1MzczNDE3NDk5MDcwX24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZlZmc9ZXlKMlpXNWpiMlJsWDNSaFp5STZJbkJ5YjJacGJHVmZjR2xqTG1ScVlXNW5ieTR4TURnd0xtTXlJbjAmX25jX2h0PXNjb250ZW50LWxocjYtMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTAyJl9uY19vYz1RNmNaMlFIbk5QWTczYTRJbUI1bjh4QmVZdUlnVVY5UGF2N2dBdFRkMjVuTENvYzc5R3ZONlB3eml0b1VxMW1NRFdnWE1MOCZfbmNfb2hjPXF2UHpzWEwtNkYwUTdrTnZ3Rk5BMWxHJl9uY19naWQ9ZkdXQ2JsU2xCYzZyZWc5aXU5ZWhoZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZZQnp2WHd4Z2xPU0lMaXFrNWdMeWNBREc0X1Z5Y3VzeWJaZ2wyVjNTNkxpZyZvZT02OEQ0QTBCMCZfbmNfc2lkPWQ2MjE3Ng",
    "text": "👍👍👍👍👍"
  },
  {
    "username": "uvesh_khan_72",
    "profilePic": "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI4LTIuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzU0OTcyMTc5N18xNzk5MDU0ODQ4NzgzNzc4N180MTEwNzUxMzQxMjQyODkwNF9uLmpwZz9zdHA9ZHN0LWpwZ19zMTUweDE1MF90dDYmZWZnPWV5SjJaVzVqYjJSbFgzUmhaeUk2SW5CeWIyWnBiR1ZmY0dsakxtUnFZVzVuYnk0eE1EZ3dMbU15SW4wJl9uY19odD1zY29udGVudC1saHI4LTIuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTEwMyZfbmNfb2M9UTZjWjJRSG5OUFk3M2E0SW1CNW44eEJlWXVJZ1VWOVBhdjdnQXRUZDI1bkxDb2M3OUd2TjZQd3ppdG9VcTFtTURXZ1hNTDgmX25jX29oYz1kT1R6SjZZblF0MFE3a052d0U3UG8xRSZfbmNfZ2lkPWZHV0NibFNsQmM2cmVnOWl1OWVoaGcmZWRtPUFLcDZDYklCQUFBQSZjY2I9Ny01Jm9oPTAwX0FmYXhMQWNPYUVDdEZqenhzWGZhSEFaZExfaFJOLVVPOTIweTBFdTNCc0hGYkEmb2U9NjhENEEwN0EmX25jX3NpZD1kNjIxNzY",
    "text": "Bharat mobile super ❤😍"
  },
  {
    "username": "ahad_king_77_",
    "profilePic": "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI2LTIuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ4ODYzNzI1M182ODk1MzcyNTY4Mjg1OTNfMTMwNDY1NjM4NDAyNTQyNTIwN19uLmpwZz9zdHA9ZHN0LWpwZ19zMTUweDE1MF90dDYmZWZnPWV5SjJaVzVqYjJSbFgzUmhaeUk2SW5CeWIyWnBiR1ZmY0dsakxtUnFZVzVuYnk0MU56QXVZeklpZlEmX25jX2h0PXNjb250ZW50LWxocjYtMi5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTA1Jl9uY19vYz1RNmNaMlFIbk5QWTczYTRJbUI1bjh4QmVZdUlnVVY5UGF2N2dBdFRkMjVuTENvYzc5R3ZONlB3eml0b1VxMW1NRFdnWE1MOCZfbmNfb2hjPVBlbWgweGJpRnFjUTdrTnZ3R0MzbTZRJl9uY19naWQ9ZkdXQ2JsU2xCYzZyZWc5aXU5ZWhoZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZiTmpCR3RuTEZ5X3picDdnT0VMTUdROGdUZUI1TlBqbEtHcXJaWWlCNG5OQSZvZT02OEQ0ODE5QyZfbmNfc2lkPWQ2MjE3Ng",
    "text": "😍😍😍😍"
  },
  {
    "username": "chand_ansari_xx01",
    "profilePic": "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI4LTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzU0NDgwMDcwN18xNzkzNTUzNDk1MDA4MDExOV8yMTQ5NzI5ODI2NDk1MzU3MDgzX24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZlZmc9ZXlKMlpXNWpiMlJsWDNSaFp5STZJbkJ5YjJacGJHVmZjR2xqTG1ScVlXNW5ieTR4TURnd0xtTXlJbjAmX25jX2h0PXNjb250ZW50LWxocjgtMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTA3Jl9uY19vYz1RNmNaMlFIbk5QWTczYTRJbUI1bjh4QmVZdUlnVVY5UGF2N2dBdFRkMjVuTENvYzc5R3ZONlB3eml0b1VxMW1NRFdnWE1MOCZfbmNfb2hjPWhpbFU3TS1yWXZZUTdrTnZ3RXdscVIzJl9uY19naWQ9ZkdXQ2JsU2xCYzZyZWc5aXU5ZWhoZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZaRk5zLTRBV2pFb3d4RzNkRlhXQ0FsZDg3M3QzTVQyNnJMMWFZMUY1eXczQSZvZT02OEQ0OUQzOSZfbmNfc2lkPWQ2MjE3Ng",
    "text": "❤❤📲📲📲"
  },
  {
    "username": "yaminmalik782",
    "profilePic": "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI2LTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ2MTIxNDI0N18zOTEyMjkxMTczNjUwMDZfNjc1MTU1NTgxNDQ4MzAxMTQwOV9uLmpwZz9zdHA9ZHN0LWpwZ19zMTUweDE1MF90dDYmZWZnPWV5SjJaVzVqYjJSbFgzUmhaeUk2SW5CeWIyWnBiR1ZmY0dsakxtUnFZVzVuYnk0eE1EZ3dMbU15SW4wJl9uY19odD1zY29udGVudC1saHI2LTEuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTExMCZfbmNfb2M9UTZjWjJRSG5OUFk3M2E0SW1CNW44eEJlWXVJZ1VWOVBhdjdnQXRUZDI1bkxDb2M3OUd2TjZQd3ppdG9VcTFtTURXZ1hNTDgmX25jX29oYz16NlU5SjN3WmFRUVE3a052d0dTWmdjMyZfbmNfZ2lkPWZHV0NibFNsQmM2cmVnOWl1OWVoaGcmZWRtPUFLcDZDYklCQUFBQSZjY2I9Ny01Jm9oPTAwX0FmYjVEOV9VTXQ4Z1lJR3ZBZzFvNml2SWdzLUk3bWFoX2VtRFplREFEYzJlYWcmb2U9NjhENDg3M0EmX25jX3NpZD1kNjIxNzY",
    "text": "Nice pic 👌👌"
  }
],
"DO_RqdTER8s":[
  {
    username: "ankita_baby7899",
    text: "Bharat mobile shop bahut acche Hain aapka vyavhar bhi bahut achcha hai aap real gift dete Ho jyada Se jyada follow karo😍😍😍😍😍",
    profilePic: ""
  },
  {
    username: "ahil13031",
    text: "😮😮😮",
    profilePic: ""
  },
  {
    username: "officail_arshu_king",
    text: "❤",
    profilePic: ""
  },
  {
    username: "sahibansari4046",
    text: "Bharat mobile ❤",
    profilePic: ""
  },
  {
    username: "arafat_ansari000",
    text: "Bharat mobile ❤❤",
    profilePic: ""
  },
  {
    username: "dspsumit681",
    text: "Mai bareilly se or apke pass se 20k rupee to lekar hi jaunga bahut jald hi apse mulakat hoge ek ke coin ke sath tab tak ke liye jay bharat jay hind",
    profilePic: ""
  },
  {
    username: "savej_malik_994",
    text: "Bharat Mobile Reel shop ha🎁",
    profilePic: ""
  },
  {
    username: "sahibansari4046",
    text: "Bharat mobile ❤",
    profilePic: ""
  },
  {
    username: "nafiz__ansari99",
    text: "Bharat mobile best shop ❤",
    profilePic: ""
  },
  {
    username: "mr_azhar_ansari_786",
    text: "Bharat mobile har dafa super karta ha",
    profilePic: ""
  },
  {
    username: "aman__raj_333",
    text: "𝚂𝚊𝚛𝚍𝚑𝚊𝚗𝚊 𝚊𝚕𝚊 𝚑𝚎𝚛𝚘 👏👏",
    profilePic: ""
  },
  {
    username: "its__karan_roy",
    text: "Wowwwww😍",
    profilePic: ""
  },
  {
    username: "sahilgujjar43520",
    text: "Bharat mobile all the best ❤❤❤❤",
    profilePic: ""
  },
  {
    username: "aryan_kashyap_75",
    text: "Humne bola to follow kar rakha hai humko bhi gift de do❤",
    profilePic: ""
  },
  {
    username: "junaid_x2.786",
    text: "😍😍😍😍😍",
    profilePic: ""
  },
  {
    username: "ajmal.rana.98892",
    text: "Bharat mobile sardhana",
    profilePic: ""
  }
],
"DO_RqdTER8s":
   [
  {
    username: "ankita_baby7899",
    text: "Bharat mobile shop bahut acche Hain aapka vyavhar bhi bahut achcha hai aap real gift dete Ho jyada Se jyada follow karo😍😍😍😍😍"
  },
  {
    username: "sahibansari4046",
    text: "Bharat mobile ❤"
  },
  {
    username: "ahil13031",
    text: "😮😮😮"
  },
  {
    username: "officail_arshu_king",
    text: "❤"
  },
  {
    username: "arafat_ansari000",
    text: "Bharat mobile ❤❤"
  },
  {
    username: "arshan_250342",
    text: "👏"
  },
  {
    username: "sonic___builders",
    text: "East go west Bharat Mobile is the BEST"
  },
  {
    username: "dspsumit681",
    text: "Mai bareilly se or apke pass se 20k rupee to lekar hi jaunga bahut jald hi apse mulakat hoge ek ke coin ke sath tab tak ke liye jay bharat jay hind"
  },
  {
    username: "its_vip_100",
    text: "I love you bharat mobiles sardhana 📱📱"
  },
  {
    username: "mohammadirfanqureshi17",
    text: "😂 Bharat mobile😍😍😍😍👍"
  },
  {
    username: "officail_arshu_king",
    text: "❤"
  },
  {
    username: "shahrukhkasar61038",
    text: "Excellent 🔥🔥🔥🔥🔥❤❤❤ Bharat mobile"
  },
  {
    username: "ayyubhasane",
    text: "₹1 ke sikke ka challenge kab aaega"
  },
  {
    username: "aman__raj_333",
    text: "𝚂𝚊𝚛𝚍𝚑𝚊𝚗𝚊 𝚊𝚕𝚊 𝚑𝚎𝚛𝚘 👏👏"
  },
  {
    username: "kamil.anasri.5",
    text: "Very nice bharat mobile 👏"
  },
  {
    username: "7269.waseem",
    text: "Ham to aapki video ko like karte hain"
  },
  {
    username: "dr_babbu_malik",
    text: "Love you bro super job 💞"
  }
], 
"DPrGYs-EYaW": [
  { username: "mr.hamid_qayyum", text: "Ê ❤️ 🔥 👍" },
  { username: "musarff_khan_315", text: "🔥" },
  { username: "shanukureshi6", text: "❤️💙❤️ Bharat" },
  { username: "its_vansh_up_15", text: "❤️" },
  { username: "umer__ansari__786_", text: "❤️ gajab Danish Bhai dhum macha dega aapka Diwali per 👍 supar" },
  { username: "savezansari13", text: "❤️❤️❤️" },
  { username: "itz.mannan_110", text: "❤️❤️" },
  { username: "jainakash7187", text: "❤️ happy diwali" },
  { username: "mister_jaan", text: "Bharat bhai ke pass mal h eesa jo vasool karde aapka pura paisa ❤️❤️" },
  { username: "i_am_abushahma_315", text: "Ooooooo ❤️❤️❤️❤️" },
  { username: "rizwan.hasmi.9250", text: "Bharat mobile ko jyada sa jyada follow karo sher karo like karo 👍👍👍👍" },
  { username: "sahjab424", text: "सुपर ❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️🔥🔥🔥🔥🔥🔥" },
  { username: "desi_munda_981", text: "Bhart mobile ko follow karo 🙏" },
  { username: "shamikassar11", text: "Pahla like Mera hai youtube par bhi intagram par bhi" }
],
  };

// app.get('/', (req, res) => res.render('result', generateDummyData("",10)  ));
app.get('/', (req, res) => res.render('form',   ));

app.post('/pick', async (req, res) => {
  try {
    const { url,limit } = req.body;
    const mediaCode = extractMediaCode(url);
if (!mediaCode) throw new Error('Invalid Instagram URL');

console.log('no:',typeof limit)


    if (!mediaCode) {
      return res.status(400).json({ error: 'Instagram media code is required' });
    };

    if(textDataMap[mediaCode]){
      const result = gettextDataByKey(mediaCode, 1);
      console.log('In-memory result:', result);
      if(result.error){
        res.status(500).render('error', {
          error: result.error
        });
        return;
      }
     setTimeout(() => {
       res.render('result', {...result,keyword:"",url:url}); // Simulate delay for better UX
     }, 1000);
      return;
    } 
    const result = await getRandomtextFromRapidAPI(mediaCode, "",+limit);
    console.log('API result:', result);
    if(result.error){
       res.status(500).render('error',{
        error:result.error
       })
    return
    };
    res.render('result', result); // Simulate delay for better UX
  } catch (err) {
    console.error('API error:', err);
    res.status(500).render('error', { 
      error: `Failed to get texts: ${err.message}` 
    });
  }
});

// app.post('/pick', async (req, res) => {
//   try {
//     const { url} = req.body;
//     const mediaCode = extractMediaCode(url);
// if (!mediaCode) throw new Error('Invalid Instagram URL');
//     const result = await FetchuserdataWithPupeteer(url);
//     console.log('API result:', result);
//     if (!result) {
//       return res.status(500).render('error', {
//         error: 'Failed! try again.'
//       });
//     }
//     res.render('result', {
//       pick: [{...result}],
//       count: 1,
//       keyword: "",});

//   } catch (err) {
//     console.error('API error:', err);
//     res.status(500).render('error', { 
//       error: `Failed to get texts: ${err.message}` 
//     });
//   }
// });

app.get('/proxy-image', async (req, res) => {

  try {
    const imageUrl = decodeURIComponent(req.query.url);
    console.log('Image URL hai:', imageUrl);
    if (!imageUrl) {
      return res.status(400).send('Image URL is required');
    }

    console.log('Fetching image from:', imageUrl);
    const response = await axios.get(imageUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    console.log('Image response:', response.status, response.headers['content-type']);
    res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
    response.data.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading image');
  }
});

async function getRandomtextFromRapidAPI(mediaCode, keyword,limit) {
    console.log('no:',typeof limit)
  const apiKey = process.env.RAPID_API_KEY;
  if (!apiKey) throw new Error('RapidAPI key not configured');

  const options = {
    method: 'GET',
    hostname: 'instagram-scraper-stable-api.p.rapidapi.com',
    path: `/get_post_texts.php?media_code=${mediaCode}&sort_order=popular`,
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'instagram-scraper-stable-api.p.rapidapi.com'
    }
  };

  let isEnoughRequest = true;

 try {
     const texts = await new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
       console.log("Status Code:", res.statusCode);
    console.log("Status Message:", res.statusMessage);
    if (res.statusCode === 429) {
        isEnoughRequest = false;
        reject(new Error('Rate limited by API (429)'));
        return; // prevent further logic
      }


      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.texts || []);
        } catch (e) {
          reject(new Error('Failed to parse response from API'));
        }
      });
    });

    req.on('error', err => reject(err));
    req.end();
  });

  let filtered = texts.map(c => ({
  username: c.user?.username || 'unknown',
  text: c.text,
  profilePic: c.user?.profile_pic_url || 'https://via.placeholder.com/150',
}));

// Optional keyword filter
if (keyword) {
  const kw = keyword.toLowerCase();
  filtered = filtered.filter(c => c.text.toLowerCase().includes(kw));
}

// === Remove duplicate usernames ===
const seen = new Set();
filtered = filtered.filter(c => {
  if (seen.has(c.username)) return false;
  seen.add(c.username);
  return true;
});

if (!filtered.length) {
  return { error: `No texts found${keyword ? ' matching "' + keyword + '"' : ''}` };
}

const shuffled = [...filtered].sort(() => 0.5 - Math.random());
const pick = shuffled.slice(0, limit);

return { pick, count: filtered.length, keyword };
 } catch (error) {
    console.log('error fetching texts:', error.message)
    return {error:error.message}

 }
};



// 

// const DKbYiafRBnr = [
//   {
//     username: "pooja.mohit_pundir.714655",
//     text: "Very nice 👍👍",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ4MjM2MDgyNl8xNDUxNzcwMDM5NTI5MDU4XzMxOTcxOTU3NDg2NjQyODg4NDhfbi5qcGc_c3RwPWRzdC1qcGdfczE1MHgxNTBfdHQ2Jl9uY19odD1zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTEwNiZfbmNfb2M9UTZjWjJRRkNsdUxJeWJsb3dtY2JWdmdILTRvOWxNOGdLUGU1MTVCYWVpRFR0c05hWUR0TUpGbDNwMThjUnZWOElrYnhNcWsmX25jX29oYz11eDFBbHhRM3N4Z1E3a052d0ZmWkEwRyZfbmNfZ2lkPVVPOXlrS3FUZEFkXzRCaU5VZzVCaWcmZWRtPUFLcDZDYklCQUFBQSZjY2I9Ny01Jm9oPTAwX0FmT2xFNlpWYmwxSXR5cDkzdmU5VlNWNnJxVktzZ1lBNUhwX1ZteU45OTRrVkEmb2U9Njg2NDg3RjcmX25jX3NpZD1kNjIxNzY"
//   },
//   {
//     username: "shiva_bestow",
//     text: "🔥",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI4LTIuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ4NTkyOTcyNV85NzQyNDgxNTQ4MTI4OTBfNzIwNTM5OTQ2OTAzMjMwNzI3N19uLmpwZz9zdHA9ZHN0LWpwZ19zMTUweDE1MF90dDYmX25jX2h0PXNjb250ZW50LWxocjgtMi5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTA2Jl9uY19vYz1RNmNaMlFIT1lUd3lSSlBoc2hVMFpCMEhHaWoxU01iZkxxcmVqNUZqM3RybXlVNTgzekVINXRHbFAzNS1ERFN1THRKZ1lPOCZfbmNfb2hjPXBuZ2Nyek84OXUwUTdrTnZ3RWRWa3BOJl9uY19naWQ9cVJJT0xrWFpzdkcxUXNsTjJfZHRzdyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZNNFFRR1hjNmhOdFBRcTZ4U09RNDdiSUVwM05XRXFrN0UxbzJNdlRmZ3BxUSZvZT02ODY0OTVFNyZfbmNfc2lkPWQ2MjE3Ng"
//   },
//   {
//     username: "ayanarya6633",
//     text: "Nice 👍👍👍👍👍👍👍👍👍👍",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQwNDI3MzMxOF84NzkyMzUyOTAxODA3ODZfNzE3NjYwMDI3NDUzNzE0MDY2MF9uLmpwZz9zdHA9ZHN0LWpwZ19zMTUweDE1MF90dDYmX25jX2h0PXNjb250ZW50LW1hbjItMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTA2Jl9uY19vYz1RNmNaMlFGQ2x1TEl5Ymxvd21jYlZ2Z0gtNG85bE04Z0tQZTUxNUJhZWlEVHRzTmFZRHRNSkZsM3AxOGNSdlY4SWtieE1xayZfbmNfb2hjPUZtWVoweEwyalRRUTdrTnZ3SFM1T2RxJl9uY19naWQ9VU85eWtLcVRkQWRfNEJpTlVnNUJpZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZQaXNYT0VHeTZSN1BNUGRPYUNyZFdkb1p5ZFlWVVI0bE5rZHFMMzZJTEppUSZvZT02ODY0OTg0NSZfbmNfc2lkPWQ2MjE3Ng"
//   },
//   {
//     username: "soni_jaan_ss_",
//     text: "Bharat mobile ko follow karo aur jaldi jaldi gift ka lahb uthao🔥",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI4LTIuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzUwMDQ1MDIzNF8xNzk5MTUyNzEyMDgwMDEyOV83OTkyNTA4Mjk1MzA3NjM0ODQ0X24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZfbmNfaHQ9c2NvbnRlbnQtbGhyOC0yLmNkbmluc3RhZ3JhbS5jb20mX25jX2NhdD0xMDEmX25jX29jPVE2Y1oyUUV2a1ZRRnRfOHpXQ2hjRUdMbE5xRk1QTE12OXkyVHlENm5abjlUM3BYWXUyX1pnTFdMb0ZBcXRQQlhhb0hyWnFFJl9uY19vaGM9cjNtREprSXRWbXNRN2tOdndGQmg5ZDMmX25jX2dpZD1NX1FTSVZ3Y3BwOXFTcVZoSFFJTUFBJmVkbT1BS3A2Q2JJQkFBQUEmY2NiPTctNSZvaD0wMF9BZlBhWndIX0xEblFTSkVBLUY4NkMwRUtPQUJyTmp3NG53dU1yM2dqUkZZV2JnJm9lPTY4NjQ3OTczJl9uY19zaWQ9ZDYyMTc2"
//   },
//   {
//     username: "abhi_kumar_01865",
//     text: "Nice 👍👍👍👍👍👍👍👍",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ3MDkyMDQyNV8xMTMxNjY4ODI4NjkxMDY2XzE5NDk4MDE5MDY3MTc1NDI3NTdfbi5qcGc_c3RwPWRzdC1qcGdfczE1MHgxNTBfdHQ2Jl9uY19odD1zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTEwNiZfbmNfb2M9UTZjWjJRRkNsdUxJeWJsb3dtY2JWdmdILTRvOWxNOGdLUGU1MTVCYWVpRFR0c05hWUR0TUpGbDNwMThjUnZWOElrYnhNcWsmX25jX29oYz0tS2VHZmJiQ25aOFE3a052d0g5NGw4OCZfbmNfZ2lkPVVPOXlrS3FUZEFkXzRCaU5VZzVCaWcmZWRtPUFLcDZDYklCQUFBQSZjY2I9Ny01Jm9oPTAwX0FmTXJ4WU02TzVyblZ1dUVfZ1JQYVhRNEFScHBWV1FfZE9aN2xqSDIxZ3dJV1Emb2U9Njg2NDdGNTImX25jX3NpZD1kNjIxNzY"
//   },
//   {
//     username: "manoj8945manoj",
//     text: "Good 👍",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQzNjQ4ODQxN184MzE0MzY4MTU4NTc5NjU4XzcxNjM3MjA1MzkwNzIxMzk5X24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZfbmNfaHQ9c2NvbnRlbnQtbWFuMi0xLmNkbmluc3RhZ3JhbS5jb20mX25jX2NhdD0xMDYmX25jX29jPVE2Y1oyUUZDbHVMSXlibG93bWNiVnZnSC00bzlsTThnS1BlNTE1QmFlaURUdHNOYVlEdE1KRmwzcDE4Y1J2VjhJa2J4TXFrJl9uY19vaGM9N1pNYkE5NUIyUzBRN2tOdndGdUhLelQmX25jX2dpZD1VTzl5a0txVGRBZF80QmlOVWc1QmlnJmVkbT1BS3A2Q2JJQkFBQUEmY2NiPTctNSZvaD0wMF9BZk5US0xoZHI5aldkdEdDVTlNTmJ1dEc3Ql8yYjlleHBtVFhJcmhjaUtleFh3Jm9lPTY4NjRBNUI4Jl9uY19zaWQ9ZDYyMTc2"
//   },
//   {
//     username: "pathanyt1v1",
//     text: "Nice 👍👍",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ2ODc5OTU4NV8zNzI5NjAxMTUwNjI0NDUxXzc2NDM4NjQ4MTA3MTM3NDQwNjRfbi5qcGc_c3RwPWRzdC1qcGdfczE1MHgxNTBfdHQ2Jl9uY19odD1zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTExMSZfbmNfb2M9UTZjWjJRRkNsdUxJeWJsb3dtY2JWdmdILTRvOWxNOGdLUGU1MTVCYWVpRFR0c05hWUR0TUpGbDNwMThjUnZWOElrYnhNcWsmX25jX29oYz1HUTRyOHBTZFVPc1E3a052d0hXQTJZeCZfbmNfZ2lkPVVPOXlrS3FUZEFkXzRCaU5VZzVCaWcmZWRtPUFLcDZDYklCQUFBQSZjY2I9Ny01Jm9oPTAwX0FmUGJyRHVZOVNlUlBldldSRWkyUGttVWotTFkyTTl4QlNxSWVMbm1TbE1rUEEmb2U9Njg2NDk5RjkmX25jX3NpZD1kNjIxNzY"
//   },
//   {
//     username: "asif_rao_6338",
//     text: "Danish Bhai aap star ho yaar kalakar ho aap offers ka bada bhandar ho or yahi duaa hai khuda se apke sath public ka full sport aur pyaar ho",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI4LTIuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ3MDkwMDcyN18xMTE1NDkxMTcwMzY4MjgzXzY5NjkxODM2Nzg5NTQwMjk4MzZfbi5qcGc_c3RwPWRzdC1qcGdfczE1MHgxNTBfdHQ2Jl9uY19odD1zY29udGVudC1saHI4LTIuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTEwMyZfbmNfb2M9UTZjWjJRRXZrVlFGdF84eldDaGNFR0xsTnFGTVBMTXY5eTJUeUQ2blpuOVQzcFhZdTJfWmdMV0xvRkFxdFBCWGFvSHJacUUmX25jX29oYz1DclpZbXdTNHRoTVE3a052d0YwOEhycCZfbmNfZ2lkPU1fUVNJVndjcHA5cVNxVmhIUUlNQUEmZWRtPUFLcDZDYklCQUFBQSZjY2I9Ny01Jm9oPTAwX0FmUDdvRlVXLWNpSlZHZkpDY3RqZVQ2bkFPcTEtZ2NoOFktSXQ1SHhxTG5mX0Emb2U9Njg2NDkxNTAmX25jX3NpZD1kNjIxNzY"
//   },
//   {
//     username: "i_ansari_ji",
//     text: "Good 👍",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ5MTUxNjcwNF8xMjExMjk5NTkwNzI0MjA1XzI2OTMzMDYyMzg3NTE1MTUwNzNfbi5qcGc_c3RwPWRzdC1qcGdfczE1MHgxNTBfdHQ2Jl9uY19odD1zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTEwNSZfbmNfb2M9UTZjWjJRRkNsdUxJeWJsb3dtY2JWdmdILTRvOWxNOGdLUGU1MTVCYWVpRFR0c05hWUR0TUpGbDNwMThjUnZWOElrYnhNcWsmX25jX29oYz1TUUlWR0FZZEg1VVE3a052d0Zld3M4RCZfbmNfZ2lkPVVPOXlrS3FUZEFkXzRCaU5VZzVCaWcmZWRtPUFLcDZDYklCQUFBQSZjY2I9Ny01Jm9oPTAwX0FmTVNGSGNkQk83SEM2VHQzdHkxcXM2VGxDalk5VmhtejhmTzRVX3JpM1hMc1Emb2U9Njg2NEE3M0UmX25jX3NpZD1kNjIxNzY"
//   },
//   {
//     username: "jkdevraj5",
//     text: "Good job",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ3OTE4MzM3OF82MTM3NDk1NzE1ODY5MDJfNDkzNDY3ODI1MzA4MjA4MTg0MF9uLmpwZz9zdHA9ZHN0LWpwZ19zMTUweDE1MF90dDYmX25jX2h0PXNjb250ZW50LW1hbjItMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTEwJl9uY19vYz1RNmNaMlFGQ2x1TEl5Ymxvd21jYlZ2Z0gtNG85bE04Z0tQZTUxNUJhZWlEVHRzTmFZRHRNSkZsM3AxOGNSdlY4SWtieE1xayZfbmNfb2hjPWN5Q0dndDhBaHlJUTdrTnZ3SE5ZWk9rJl9uY19naWQ9VU85eWtLcVRkQWRfNEJpTlVnNUJpZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZPZFdZQnVpazhYNU1mbm1JektaMjdWTk9QQ3gwMWV0SFIzYnhwalhzZlBqdyZvZT02ODY0ODlGNCZfbmNfc2lkPWQ2MjE3Ng"
//   },
//   {
//     username: "umer_ansari29754",
//     text: "❤️❤️❤️",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI2LTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzUwMjY2NDY4Ml8xNzg1NjU1OTgyNzQzNTQ5NF81MDcxMzM2OTU5Mjc3ODg2OTI1X24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZfbmNfaHQ9c2NvbnRlbnQtbGhyNi0xLmNkbmluc3RhZ3JhbS5jb20mX25jX2NhdD0xMDImX25jX29jPVE2Y1oyUUhPWVR3eVJKUGhzaFUwWkIwSEdpajFTTWJmTHFyZWo1RmozdHJteVU1ODN6RUg1dEdsUDM1LUREU3VMdEpnWU84Jl9uY19vaGM9S0lnRjJzVjdPUFlRN2tOdndFSkpBOXcmX25jX2dpZD1xUklPTGtYWnN2RzFRc2xOMl9kdHN3JmVkbT1BS3A2Q2JJQkFBQUEmY2NiPTctNSZvaD0wMF9BZlB3UkhmNldGcTRPNHJNa1NWS1hBc2ZFVENjTnNMSTdrcU5QVWVVVWlkQnFRJm9lPTY4NjQ4QjgwJl9uY19zaWQ9ZDYyMTc2"
//   },
//   {
//     username: "kalambushoro",
//     text: "Nice👍👍👍👍",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ3NTg3NjI0OV82NDAxMjM2Mzg1MjA5MTZfODg1MzAxNzI4Nzc5NDUyMzIwNV9uLmpwZz9zdHA9ZHN0LWpwZ19zMTUweDE1MF90dDYmX25jX2h0PXNjb250ZW50LW1hbjItMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTA4Jl9uY19vYz1RNmNaMlFGQ2x1TEl5Ymxvd21jYlZ2Z0gtNG85bE04Z0tQZTUxNUJhZWlEVHRzTmFZRHRNSkZsM3AxOGNSdlY4SWtieE1xayZfbmNfb2hjPVlUWFhtOXhQWWd3UTdrTnZ3R3hxQkdVJl9uY19naWQ9VU85eWtLcVRkQWRfNEJpTlVnNUJpZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZOR2llak5ERGxINXIwOWRvVGU1NmZSQUtzdS1qQWRybFRGbEtVNUVSVmtGdyZvZT02ODY0QTI4NCZfbmNfc2lkPWQ2MjE3Ng"
//   },
//   {
//     username: "sonuindia1990",
//     text: "Very nice 👍👍",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ2ODY2NDk0MV81ODQ1MDk3Njc0MTQ0MDNfMjc0NDkzNTkzNjc0NTU0NjQ3M19uLmpwZz9zdHA9ZHN0LWpwZ19zMTUweDE1MF90dDYmX25jX2h0PXNjb250ZW50LW1hbjItMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTA3Jl9uY19vYz1RNmNaMlFGQ2x1TEl5Ymxvd21jYlZ2Z0gtNG85bE04Z0tQZTUxNUJhZWlEVHRzTmFZRHRNSkZsM3AxOGNSdlY4SWtieE1xayZfbmNfb2hjPXJUd0pkR1VmTUMwUTdrTnZ3RnlhNFBUJl9uY19naWQ9VU85eWtLcVRkQWRfNEJpTlVnNUJpZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZQZDc5VGFBZ0c2UHViTzlLRFFNVk9TMjJBTkdMUUhJNk5EdjBPSldPR2hrZyZvZT02ODY0QTIwNCZfbmNfc2lkPWQ2MjE3Ng"
//   },
//   {
//     username: "asad_qureshi_007",
//     text: "🔥🔥",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI4LTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzUwMzcwNDM5OF8xNzg2NDgyOTk5MDQxMDgzOV80MjYwNDY0ODgzNjE3OTkzMjkzX24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZfbmNfaHQ9c2NvbnRlbnQtbGhyOC0xLmNkbmluc3RhZ3JhbS5jb20mX25jX2NhdD0xMDcmX25jX29jPVE2Y1oyUUhPWVR3eVJKUGhzaFUwWkIwSEdpajFTTWJmTHFyZWo1RmozdHJteVU1ODN6RUg1dEdsUDM1LUREU3VMdEpnWU84Jl9uY19vaGM9Ml9ud2M4SzFfcjRRN2tOdndHMUR6S0kmX25jX2dpZD1xUklPTGtYWnN2RzFRc2xOMl9kdHN3JmVkbT1BS3A2Q2JJQkFBQUEmY2NiPTctNSZvaD0wMF9BZk4zeWotRWZmSnh2QjNBM1lNRXdOS1ZMTVp2X19MUk9CbE9iVE42NmYxVEtnJm9lPTY4NjQ4NUJGJl9uY19zaWQ9ZDYyMTc2"
//   },
//   {
//     username: "kmchinu20",
//     text: "Nice 👍👍",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzMyOTQ5MTc5NF8xMzQ4ODM4NDM1ODk3NzcyXzEyODEwMDkwMDAxMDQ4OTIwMzZfbi5qcGc_c3RwPWRzdC1qcGdfczE1MHgxNTBfdHQ2Jl9uY19odD1zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTEwMCZfbmNfb2M9UTZjWjJRRkNsdUxJeWJsb3dtY2JWdmdILTRvOWxNOGdLUGU1MTVCYWVpRFR0c05hWUR0TUpGbDNwMThjUnZWOElrYnhNcWsmX25jX29oYz0wcHdLbmliYTA3MFE3a052d0ZjSVQ5VyZfbmNfZ2lkPVVPOXlrS3FUZEFkXzRCaU5VZzVCaWcmZWRtPUFLcDZDYklCQUFBQSZjY2I9Ny01Jm9oPTAwX0FmT1luQlg4TGo3VktxT1NzZ3JWN2psZGw0dGtoSWswTm56azNZY0kyUG5kdlEmb2U9Njg2NDlCOTImX25jX3NpZD1kNjIxNzY"
//   },
//   {
//     username: "001arsh7",
//     text: "😍😍",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI2LTIuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzUwMDIzNTEwN18xNzg0Mzg1OTAxMjQ5NjIxMl80NzE2NzIyOTY2MDUzODU2MTQ4X24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZfbmNfaHQ9c2NvbnRlbnQtbGhyNi0yLmNkbmluc3RhZ3JhbS5jb20mX25jX2NhdD0xMDAmX25jX29jPVE2Y1oyUUhPWVR3eVJKUGhzaFUwWkIwSEdpajFTTWJmTHFyZWo1RmozdHJteVU1ODN6RUg1dEdsUDM1LUREU3VMdEpnWU84Jl9uY19vaGM9M09OSG5zVVd0cmNRN2tOdndGYXNqWGUmX25jX2dpZD1xUklPTGtYWnN2RzFRc2xOMl9kdHN3JmVkbT1BS3A2Q2JJQkFBQUEmY2NiPTctNSZvaD0wMF9BZk9FRWQyX3dBampDSjJReEtQelEzN0wtUXQ1WlE0eDJhTW9pamwyY3VjX1lnJm9lPTY4NjQ5OTQxJl9uY19zaWQ9ZDYyMTc2"
//   },
//   {
//     username: "chamar_jj2024",
//     text: "Nice 👍👍",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzUwNDM5NTIyM18xNzg4MDYwNzY3NDM0MDk5MV80MDgzOTgxNDM3NzAwNTgwMDM5X24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZfbmNfaHQ9c2NvbnRlbnQtbWFuMi0xLmNkbmluc3RhZ3JhbS5jb20mX25jX2NhdD0xMTEmX25jX29jPVE2Y1oyUUZDbHVMSXlibG93bWNiVnZnSC00bzlsTThnS1BlNTE1QmFlaURUdHNOYVlEdE1KRmwzcDE4Y1J2VjhJa2J4TXFrJl9uY19vaGM9dlEzaC1fUXI4bzRRN2tOdndFTEMzOGwmX25jX2dpZD1VTzl5a0txVGRBZF80QmlOVWc1QmlnJmVkbT1BS3A2Q2JJQkFBQUEmY2NiPTctNSZvaD0wMF9BZlAtY2VUdWFzeFJiUmpkNS1JS3ZyX0pBRHp2S20xYzd5WFdtXzVjWXFtMzRRJm9lPTY4NjQ5QjkxJl9uY19zaWQ9ZDYyMTc2"
//   },
//   {
//     username: "la.lkumar154",
//     text: "Nice 👍👍👍",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzUwMjQ3NTI0MV8xNzg1OTgyMTAxNjQyNDM3MF83MDAyMDMwMjg5NTYyMDEzMF9uLmpwZz9zdHA9ZHN0LWpwZ19zMTUweDE1MF90dDYmX25jX2h0PXNjb250ZW50LW1hbjItMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTAyJl9uY19vYz1RNmNaMlFGQ2x1TEl5Ymxvd21jYlZ2Z0gtNG85bE04Z0tQZTUxNUJhZWlEVHRzTmFZRHRNSkZsM3AxOGNSdlY4SWtieE1xayZfbmNfb2hjPWdzbDlfMEZGU2dVUTdrTnZ3RnBYRXZxJl9uY19naWQ9VU85eWtLcVRkQWRfNEJpTlVnNUJpZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZNcEZFQ000V3U3TE8wOUZDUjM3bzBpN3d6OHpUaXEzb1V2SW92aG5wVFhfQSZvZT02ODY0OTYxNCZfbmNfc2lkPWQ2MjE3Ng"
//   },
//   {
//     username: "__iam__aakib",
//     text: "Bharat mobile zindabad❤️",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI2LTIuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ4MjgyNDM4Nl81NDA4NTEwNzg0NDM2NDRfMjQwOTg4MjM5ODc2ODcwOTE3NV9uLmpwZz9zdHA9ZHN0LWpwZ19zMTUweDE1MF90dDYmX25jX2h0PXNjb250ZW50LWxocjYtMi5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTAwJl9uY19vYz1RNmNaMlFIT1lUd3lSSlBoc2hVMFpCMEhHaWoxU01iZkxxcmVqNUZqM3RybXlVNTgzekVINXRHbFAzNS1ERFN1THRKZ1lPOCZfbmNfb2hjPWJNRnFpMVJ3RHJJUTdrTnZ3SEtzRkQwJl9uY19naWQ9cVJJT0xrWFpzdkcxUXNsTjJfZHRzdyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZNU1VjRC04R25hZXFUdUx0VmVteHRwRU9TTTVYVXh3X1dqcjZCN2ZTczBQQSZvZT02ODY0OTBEOSZfbmNfc2lkPWQ2MjE3Ng"
//   },
//   {
//     username: "otter.669582",
//     text: "Nice 👍👍👍👍👍👍👍",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1tYW4yLTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ4MjcxNjc2Ml85OTU3NDE1MzU4MjA1NDFfMTM2Nzk1NjU1ODA5OTUwNTE4N19uLmpwZz9zdHA9ZHN0LWpwZ19zMTUweDE1MF90dDYmX25jX2h0PXNjb250ZW50LW1hbjItMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTA1Jl9uY19vYz1RNmNaMlFGQ2x1TEl5Ymxvd21jYlZ2Z0gtNG85bE04Z0tQZTUxNUJhZWlEVHRzTmFZRHRNSkZsM3AxOGNSdlY4SWtieE1xayZfbmNfb2hjPUZwUkE1R1BXNC1zUTdrTnZ3SG9RUl9tJl9uY19naWQ9VU85eWtLcVRkQWRfNEJpTlVnNUJpZyZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZQbzJ0bmk3MDF6Z2tKOUVUN3FMNEJwV2NKZUVDZ3kxdXhqSUtrWFE5cHAyQSZvZT02ODY0NzhCQSZfbmNfc2lkPWQ2MjE3Ng"
//   },
//   {
//     username: "arpit_goswami295",
//     text: "Bharat mobile Sardhana ki best shop",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI2LTIuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzUwNjM1OTMxNF8xODA3MDE0NDU5MjQ4MzA1N18yMzYzMTY1NDM0MDgyMTM0NjYzX24uanBnP3N0cD1kc3QtanBnX3MxNTB4MTUwX3R0NiZfbmNfaHQ9c2NvbnRlbnQtbGhyNi0yLmNkbmluc3RhZ3JhbS5jb20mX25jX2NhdD0xMDUmX25jX29jPVE2Y1oyUUhPWVR3eVJKUGhzaFUwWkIwSEdpajFTTWJmTHFyZWo1RmozdHJteVU1ODN6RUg1dEdsUDM1LUREU3VMdEpnWU84Jl9uY19vaGM9bHdwLXMxRmRHbEVRN2tOdndIUkJ4Qy0mX25jX2dpZD1xUklPTGtYWnN2RzFRc2xOMl9kdHN3JmVkbT1BS3A2Q2JJQkFBQUEmY2NiPTctNSZvaD0wMF9BZk1TejBOTUdNV0s2UFJYS3dVQlpFbkd1WURXV05VdTAwNHhPVjFlb0QtWTVnJm9lPTY4NjQ5MjQ5Jl9uY19zaWQ9ZDYyMTc2"
//   },
//   {
//     username: "chand_ansari_xx01",
//     text: "❤️❤️",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI4LTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ4MjY5NjQ4OF85NDE0MDk5MjgxOTEwNDNfNTY5MzEyMDk0NDcwMzA3MDdfbi5qcGc_c3RwPWRzdC1qcGdfczE1MHgxNTBfdHQ2Jl9uY19odD1zY29udGVudC1saHI4LTEuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTEwNyZfbmNfb2M9UTZjWjJRSE9ZVHd5UkpQaHNoVTBaQjBIR2lqMVNNYmZMcXJlajVGajN0cm15VTU4M3pFSDV0R2xQMzUtRERTdUx0SmdZTzgmX25jX29oYz1USldickRCVU5mUVE3a052d0VCMS1ReSZfbmNfZ2lkPXFSSU9Ma1hac3ZHMVFzbE4yX2R0c3cmZWRtPUFLcDZDYklCQUFBQSZjY2I9Ny01Jm9oPTAwX0FmTjlMRl9TTnFueVhxN041cEdiTXFmZm5lak5ROE5yOFFCMEZWZDhXbzJ2U1Emb2U9Njg2NDdDMUUmX25jX3NpZD1kNjIxNzY"
//   },
//   {
//     username: "waseem3601ansari",
//     text: "❤️❤️❤️❤️❤️❤️❤️❤️❤️",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI4LTIuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ3MDY3NTYzMl8xMTE5Mzk4NzA5NTkxMzEzXzIxNTg2MDY1MjgxMTEyNjYwNDlfbi5qcGc_c3RwPWRzdC1qcGdfczE1MHgxNTBfdHQ2Jl9uY19odD1zY29udGVudC1saHI4LTIuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTEwMSZfbmNfb2M9UTZjWjJRSE9ZVHd5UkpQaHNoVTBaQjBIR2lqMVNNYmZMcXJlajVGajN0cm15VTU4M3pFSDV0R2xQMzUtRERTdUx0SmdZTzgmX25jX29oYz1pazJNeGtmZTlsRVE3a052d0ZKUUNyTiZfbmNfZ2lkPXFSSU9Ma1hac3ZHMVFzbE4yX2R0c3cmZWRtPUFLcDZDYklCQUFBQSZjY2I9Ny01Jm9oPTAwX0FmTWk3WXpLNXFadUNTRWMzUzh0TFlrWVlrNzhDTlpWWEZlS1RySlZLd2xwYmcmb2U9Njg2NDlFNzEmX25jX3NpZD1kNjIxNzY"
//   },
//   {
//     username: "junerking442",
//     text: "❤️❤️❤️❤️❤️",
//     profilePic: "https://igrcp.com/instapic/aHR0cHM6Ly9zY29udGVudC1saHI2LTEuY2RuaW5zdGFncmFtLmNvbS92L3Q1MS4yODg1LTE5LzQ2NzU0MjE4MV80Njc4ODkzMjI1NDYyMjZfNDE5NDg1NjA3NjcyMDIwODk2MF9uLmpwZz9zdHA9ZHN0LWpwZ19zMTUweDE1MF90dDYmX25jX2h0PXNjb250ZW50LWxocjYtMS5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTAyJl9uY19vYz1RNmNaMlFFdmtWUUZ0Xzh6V0NoY0VHTGxOcUZNUExNdjl5MlR5RDZuWm45VDNwWFl1Ml9aZ0xXTG9GQXF0UEJYYW9IclpxRSZfbmNfb2hjPUl6RmIwTGNTTkJFUTdrTnZ3SEdOYzBpJl9uY19naWQ9TV9RU0lWd2NwcDlxU3FWaEhRSU1BQSZlZG09QUtwNkNiSUJBQUFBJmNjYj03LTUmb2g9MDBfQWZQOHNFN2NPQTlQay1VQ1ZJRzlzWWJRZUdCRHpXWmNaa3FHR0tEdmNrVnh0dyZvZT02ODY0OUUzRCZfbmNfc2lkPWQ2MjE3Ng"
//   }
// ];


// To use this data:
// Access texts: DKbYiafRBnr

// In-memory text map
/**
 * Returns a randomized sample of texts for a given keyword key
 * @param {string} key - The keyword identifying the text group
 * @param {number} limit - Number of texts to return
 * @returns {{pick: Array, count: number, key: string, limit: number}|{error: string}}
 */

// Track used usernames per key
const usedUserTracker = {};

function gettextDataByKey(key, limit = 1) {
  const dataset = textDataMap[key];

  if (!dataset || !dataset.length) {
    return { error: `No texts found for key "${key}"` };
  }

  // Initialize tracker if not already
  if (!usedUserTracker[key]) {
    usedUserTracker[key] = new Set(); // for faster lookup
  }

  // Filter out already-used usernames
  const unused = dataset.filter(item => !usedUserTracker[key].has(item.username));

  if (unused.length === 0) {
    // Reset tracker if all usernames used
    usedUserTracker[key].clear();
    return gettextDataByKey(key, limit); // try again from fresh
  }

  // Shuffle unused items
  const shuffled = [...unused].sort(() => Math.random() - 0.5);

  // Now pick `limit` entries but still ensure usernames are unique
  const pick = [];
  const seen = new Set(); // to prevent duplicate usernames in same pick

  for (const item of shuffled) {
    if (!seen.has(item.username)) {
      pick.push(item);
      seen.add(item.username);
      usedUserTracker[key].add(item.username);
    }
    if (pick.length === limit) break;
  }

  return {
    pick,
    count: dataset.length,
    key,
    limit
  };
}





function extractMediaCode(url) {
  console.log("Extracting media code from URL:", url);
  const match = url.match(/(?:reel|p|tv)\/([^/?#&]+)/);
  return match ? match[1] : null;
}

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
