exports.verifyNoFormula = (req, res, next) => {
  for (key of Object.keys(req.body)) {
    try {
      if (req.body[key].startsWith('=') || req.body[key].startsWith('+')) {
        const err = new Error('Forbudt symbol i forespørselens nyttelast');
        err.status = 403;
        return next(err);
      }
    } catch (e) {}
    try {
      if (req.body[key].includes('<script>')) {
        const err = new Error('Godt forsøk');
        err.status = 418;
        return next(err);
      }
    } catch (e) {}
  }
  return next();
};
