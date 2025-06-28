const puppeteer = require('puppeteer');

/**
 * Fetches Instagram winner data from the given IGRCP reel URL.
 *
 * @param {string} url - The Instagram reel URL (e.g., https://www.instagram.com/reel/xyz/)
 * @returns {Promise<{ username: string | null, comment: string | null, imgUrl: string | null }>} 
 *          An object containing the winner's username, their comment, and their profile picture URL.
 */

async function FetchuserdataWithPupeteer(url){
  // Launch browser (set headless: false to see the action)
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    // Navigate to target website
    await page.goto('https://igrcp.com/instagram-comment-picker', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // STEP 1: Wait for and paste text into the input field
    await page.waitForSelector('#instagram-post', { visible: true, timeout: 10000 });
    
    // Focus on the input field
    await page.focus('#instagram-post');
    
    // Clear existing value if any (optional)
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    
    // Paste your Instagram link (using clipboard method)
    const instagramLink = url;
    await page.evaluate((text) => {
      const input = document.querySelector('#instagram-post');
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, instagramLink);

    // STEP 2: Click the button
    await page.waitForSelector('#fetch-btn', { visible: true });
    
    // Click with human-like delay
    await page.click('#fetch-btn', {
      delay: 100,  // 100ms delay between mousedown and mouseup
      waitUntil: 'networkidle2'  // Wait for network activity to settle
    });

    console.log('Button clicked! Waiting for results...');

      // 3. Wait for SweetAlert popup to appear
    await page.waitForSelector('.swal2-popup.swal2-show', { 
      visible: true, 
      timeout: 15000 
    });
    console.log('SweetAlert popup appeared');

    // 4. Wait for the FREE button to be clickable
    await page.waitForSelector('.swal2-cancel.swal2-styled', { 
      visible: true, 
      timeout: 5000 
    });

    // 5. Click the "Load 50 Comments (FREE)" button
    await page.evaluate(() => {
      const freeButton = document.querySelector('.swal2-cancel.swal2-styled');
      freeButton.click();
    });
    console.log('Clicked "Load 50 Comments (FREE)" button');


// ✅ Wait for the "Continue" button to appear
await page.waitForSelector('.swal2-confirm.swal2-styled', { visible: true });
console.log('"Continue" button is visible');

// Optional: verify it's the correct button (innerText === 'Continue')
const continueBtn = await page.$('.swal2-confirm.swal2-styled');
const continueText = await page.evaluate(el => el.innerText.trim(), continueBtn);
if (continueText !== 'Continue') {
  throw new Error(`Expected 'Continue' button, but found: "${continueText}"`);
}

// Click the "Continue" button
await continueBtn.click();
console.log('Clicked "Continue" button');

// ✅ Wait for the modal to close and comments to appear
await page.waitForSelector('.swal2-container', { hidden: true, timeout: 10000 });
await page.waitForSelector('#pick-btn', { visible: true, timeout: 15000 });
console.log('"Pick a Winner" button is visible');

// Click "Pick a Winner"
await page.click('#pick-btn');
console.log('Clicked "Pick a Winner" button');
// Wait for the winner modal and the "Pick Another" button
await page.waitForSelector('.swal2-confirm.swal2-styled', { visible: true, timeout: 10000 });
await page.waitForSelector('.swal2-html-container', { visible: true, timeout: 10000 });

// Extract data
const winnerData = await page.evaluate(() => {
  const imgEl = document.querySelector('.swal2-html-container img');
  const usernameEl = document.querySelector('.swal2-html-container a strong');
  const commentEl = document.querySelector('.swal2-html-container p');

  const imgUrl = imgEl?.src || null;
  const username = usernameEl?.innerText || null;
  const comment = commentEl?.innerText || null;

  return {
    username,
    text: comment,
    profilePic: imgUrl
  };
});

// Log and return
console.log('🥇 Winner Info:', winnerData);
return winnerData;


  } catch (error) {
    console.error('Error:', error);
    return null;
    // Take screenshot on failure
    await page.screenshot({ path: 'error.png' });
  } finally {
    // Uncomment to close browser when done
    await browser.close();
  }
};

module.exports = FetchuserdataWithPupeteer;