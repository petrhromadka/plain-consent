// Runs before the banner: ?lang=xx sets <html lang>, which the banner follows with "language": "auto".
{
  const requested = new URLSearchParams(location.search).get("lang");
  if (requested && /^(cs|sk|en|de|pl)$/.test(requested)) document.documentElement.lang = requested;
}
