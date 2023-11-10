/**
 * You can find more format from site: https://fakerjs.dev/api/.
 */

const cli = require('@bndynet/cli');
const { faker } = require('@faker-js/faker');

const countries: string[] = faker.helpers.multiple(faker.location.country, { count: 10 });
const states: string[] = faker.helpers.multiple(faker.location.state, { count: 10 });

const d = {
  number: {
    default: () => faker.number.int({ min: 0, max: 10000 }),
  },
  pie: {
    default: () => ({
      country: faker.location.country(),
      visits: faker.number.int({ min: 0, max: 1000 }),
    }),
  },
  xy: {
    default: () => {
      const result: any = {
        dateTime: generateDateTime('M'),
      };
      states.slice(0, 5).forEach((element: any) => {
        result[element] = faker.number.int({ max: 10000 });
      });
      return result;
    },
  },
  wordCloud: {
    default: () => {
      return {
        key: faker.word.words(1),
        value: faker.number.int({ min: 0, max: 10 }),
      }
    }
  }
};

let currentDt = new Date();
currentDt.setFullYear(new Date().getFullYear() - 10);
function generateDateTime(intervalUnit: 'Y' | 'M' | 'D' | 'h' | 'm' | 's') {
  const result = new Date(currentDt.getTime());
  switch (intervalUnit) {
    case 'Y':
      result.setFullYear(currentDt.getFullYear() + 1);
      break;
    case 'M':
      result.setMonth(currentDt.getMonth() + 1);
      break;
    case 'D':
      result.setDate(currentDt.getDate() + 1);
      break;
    case 'h':
      result.setHours(currentDt.getHours() + 1);
      break;
    case 'm':
      result.setMinutes(currentDt.getMinutes() + 1);
      break;
    case 's':
      result.setSeconds(currentDt.getSeconds() + 1);
      break;
  }

  currentDt = new Date(result.getTime());

  return result;
}

function showHelp() {
  cli.print(`Example:`);
  cli.print(`\t npm run data -- --pie --default --10`);
  cli.print('');

  const rootArgs = Object.keys(d);
  cli.print(`All arguments:`);
  rootArgs.forEach((arg) => {
    cli.print(`\t-- --${arg} [--<${Object.keys(d[arg as keyof typeof d]).join('|')}>] [--<count>]`);
  });
  cli.print('');
  cli.print(`  Note: `);
  cli.print(`\t${cli.styles.bold('--default')}: \t not required, it is default`);
  cli.print(`\t${cli.styles.bold('--<count>')}: \t default is 10`);
  cli.print('');
}

function g(widgetType: string, dataCategory: string, count: number) {
  const data = faker.helpers.multiple((d[widgetType as keyof typeof d] as any)[dataCategory], { count });
  cli.print(cli.styles.bold(`json format:`));
  cli.print('');
  cli.print(data);
  cli.print('');
  cli.print(cli.styles.bold(`string format:`));
  cli.print('');
  cli.print(JSON.stringify(data));
  cli.print('');
}

function start() {
  let args = process.argv.filter((arg) => arg.startsWith('--')).map((arg) => arg.replace(/^--/g, ''));
  if (args.length === 0) {
    cli.warn('No enough arguments. Please see following available arguments:');
    cli.print('');
    showHelp();
    return;
  }

  const count = parseInt(args.find((a) => !isNaN(a as any)) || '10');
  args = args.filter((a) => isNaN(a as any));

  g(args[0], args[1] || 'default', count);
}

start();
