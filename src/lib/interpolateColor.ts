type RGB = `${number}, ${number}, ${number}`;
type RGBA = `${number}, ${number}, ${number}, ${number}`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

function parseColor(color: Color): number[] {
  const parse = color.split(',');

  if (parse.length == 1) {
    const groups = parse[0].match(/([\w\d]{2})/g);
    const colors = groups?.map(x => parseInt(x, 16));
    if (!colors) throw new Error(`${color} is not an valid color`);
    return colors;
  } else if (parse.length >= 3) {
    return parse.map(x => parseInt(x));
  } else {
    throw new Error(`${color} is not an valid color`);
  }
}

export function interpolateValue(
  a: number,
  b: number,
  fraction: number,
): number {
  return Math.round((b - a) * fraction + a);
}

export function interpolateColor(
  a: Color,
  b: Color,
  fraction: number,
): number[] {
  const parsedA = parseColor(a);
  const parsedB = parseColor(b);
  const finalColor = [0, 0, 0].map((_, i) =>
    interpolateValue(parsedA[i], parsedB[i], fraction),
  );
  return finalColor;
}

export function multiInterpolateColor(
  ranges: { [fraction: number]: Color },
  fraction: number,
) {
  const stops = Object.keys(ranges)
    .map(parseFloat)
    .sort((a, b) => a - b);

  if (fraction <= stops[0])
    return interpolateColor(ranges[stops[0]], ranges[stops[0]], 0);

  if (fraction >= stops[stops.length - 1])
    return interpolateColor(
      ranges[stops[stops.length - 1]],
      ranges[stops[stops.length - 1]],
      0,
    );

  let lower = stops[0];
  let upper = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (fraction >= stops[i] && fraction <= stops[i + 1]) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  const rangeFraction = (fraction - lower) / (upper - lower);

  return interpolateColor(ranges[lower], ranges[upper], rangeFraction);
}
