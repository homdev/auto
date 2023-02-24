import { chromium } from 'playwright';
import { useEffect, useState } from 'react';
import axios from 'axios';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';

const WAIT_TIME_MS = 5000; // Temps d'attente aléatoire entre chaque requête

const solveCaptcha = async (captchaUrl) => {
  const apiKey = 'your-2captcha-api-key';
  const method = 'post';
  const url = `http://2captcha.com/in.php?key=${apiKey}&method=base64&body=${captchaUrl}`;
  const response = await axios({ method, url });

  if (response.data?.status !== 1) {
    throw new Error('Failed to submit captcha to 2captcha');
  }

  const captchaId = response.data.request;
  const getResultUrl = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${captchaId}&json=1`;

  let result;
  while (!result) {
    const getResultResponse = await axios({ method, url: getResultUrl });
    if (getResultResponse.data?.request === 'CAPCHA_NOT_READY') {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } else {
      result = getResultResponse.data.request;
    }
  }

  return result;
};

export default function IndexPage({ voitures }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(voitures);
  }, []);

  return (
    <div>
      <h1>Voitures</h1>
      <ul>
        {data.map((voiture, index) => (
          <li key={index}>
            <p>{voiture.titre}</p>
            <p>{voiture.prix}</p>
            <p>{voiture.annee}</p>
            <p>{voiture.kilometrage}</p>
            <p>{voiture.carburant}</p>
            <p>{voiture.boite}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps(pageContext) {
    const baseUrl = `https://www.leboncoin.fr/voitures/offres/pays_de_la_loire/loire_atlantique`;
  try {
    const proxies = [
      'ipgiaqsk:lV3lM8i6t4j7zWIW_country-France_session-TUCKXVK:3.213.163.116:31112',
    ];
    

    
    const browser = await chromium.launch({
      proxy: {
        server: `http://proxy....`,
        bypass: 'localhost',
        noSSL: true,
      },
    });
    
    const context = await browser.newContext({
      locale: 'fr-FR', // Configurez la localisation française
      userAgent: USER_AGENT, // Configurez l'User-Agent
    });
    
    const page = await context.newPage();
    console.log(await page.content());

  // Accéder à une page à l'aide du proxy pour vérifier la connexion
    console.log('Navigating to', baseUrl);
    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Connected to Leboncoin');

    const pageContent = await page.content();
    console.log("page content", pageContent);
    
    const annonces = await page.$$('a[data-qa-id="aditem_container"][href*="/voitures/"]');
    console.log('Found', annonces.length, 'annonces');
    
    const voiturePromises = annonces.map(async function (annonce) {
        const titre = await annonce.$eval('p[data-qa-id="aditem_title"]', (el) =>
          el.innerText.trim()
        );
        console.log('Found titre', titre);
        const prix = await annonce.$eval('span[data-qa-id="aditem_price"]', (el) =>
          el.innerText.trim()
        );
        console.log('Found prix', prix);
        const annee = await annonce.$eval('div[data-qa-id="aditem-regdate"]', (el) =>
          el.innerText.trim()
        );
        const kilometrage = await annonce.$eval('div[data-qa-id="aditem-mileage"]',
          (el) => el.innerText.trim()
        );
        const carburant = await annonce.$eval(
          'div[data-qa-id="aditem_fuel_type"]',
          (el) => el.innerText.trim()
        );
        const boite = await annonce.$eval(
          'div[data-qa-id="aditem_gearbox"]',
          (el) => el.innerText.trim()
        );
    
        // Vérifiez si un captcha est présent
const captchaFrame = await page.$('#captcha__frame');
if (captchaFrame) {
  const captchaResponse = await solveCaptcha(captchaUrl);
  await page.type('.audio-captcha-inputs', captchaResponse); // Remplissez la réponse du captcha
  await page.click('.audio-captcha-verify-button'); // Soumettez la réponse du captcha
}
    
        return {
          titre,
          prix,
          annee,
          kilometrage,
          carburant,
          boite,
        };
      });
    
      const voitures = await Promise.all(voiturePromises); // Exécutez toutes les promesses en parallèle et attendez qu'elles se terminent
    
      await browser.close(); // Fermez le navigateur
    
      return {
        props: {
          voitures,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        props: {
          voitures: [],
        },
      };
    }
}    