const Warning = function ({
  prediction,
  id,
  severity,
  type,
  time,
  place,
  from,
  to,
  unit,
  precipitation_types,
}) {
  if (prediction === undefined)
    prediction = Prediction(
      type,
      time,
      place,
      from,
      to,
      unit,
      precipitation_types
    );
  const getId = () => id;
  const getSeverity = () => severity;
  return { getId, getSeverity, prediction };
};

const WeatherData = function (type, time, place, unit) {
  const getType = () => type;
  const getTime = () => time;
  const getPlace = () => place;
  const getUnit = () => unit;
  return { getPlace, getType, getUnit, getTime };
};

const DataRange = function (from, to) {
  const getFrom = () => from;
  const getTo = () => to;
  return { getFrom, getTo };
};

const Prediction = function ({
  weatherData,
  range,
  type,
  time,
  place,
  from,
  to,
  unit,
  precipitation_types,
}) {
  if (weatherData === undefined)
    weatherData = WeatherData(type, time, place, unit);
  if (range === undefined) range = DataRange(from, to);
  const getPrecipitationTypes = () => precipitation_types;
  return { weatherData, range, getPrecipitationTypes };
};

const HistoricData = function ({
  weatherData,
  value,
  type,
  time,
  place,
  unit,
}) {
  if (weatherData === undefined)
    weatherData = WeatherData(type, time, place, unit);

  const getValue = () => value;
  return { weatherData, getValue };
};

const forecast = function ({
  weatherData,
  range,
  type,
  time,
  place,
  from,
  to,
  unit,
  precipitation_type,
  directions,
  value,
}) {
  if (weatherData === undefined)
    weatherData = WeatherData(type, time, place, unit);
  if (range === undefined) range = DataRange(from, to);
  const getPrecipitationTypes = () => precipitation_type;
  const getDirections = () => directions;
  const getValue = () => value;
  return { weatherData, range, getPrecipitationTypes, getDirections, getValue };
};
