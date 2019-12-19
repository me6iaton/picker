import MockDate from 'mockdate';
import momentGenerateConfig from '../src/generate/moment';
import { getMoment } from './util/commonUtil';

describe('Picker.Generate', () => {
  beforeAll(() => {
    MockDate.set(getMoment('1990-09-03 01:02:03').toDate());
  });

  afterAll(() => {
    MockDate.reset();
  });

  [{ name: 'moment', generateConfig: momentGenerateConfig }].forEach(
    ({ name, generateConfig }) => {
      describe(name, () => {
        it('get', () => {
          const now = generateConfig.getNow();
          expect(generateConfig.getWeekDay(now)).toEqual(1);
          expect(generateConfig.getSecond(now)).toEqual(3);
          expect(generateConfig.getMinute(now)).toEqual(2);
          expect(generateConfig.getHour(now)).toEqual(1);
          expect(generateConfig.getDate(now)).toEqual(3);
          expect(generateConfig.getMonth(now)).toEqual(8);
          expect(generateConfig.getYear(now)).toEqual(1990);
        });

        it('set', () => {
          let date = generateConfig.getNow();
          date = generateConfig.setYear(date, 2020);
          date = generateConfig.setMonth(date, 9);
          date = generateConfig.setDate(date, 23);
          date = generateConfig.setHour(date, 2);
          date = generateConfig.setMinute(date, 3);
          date = generateConfig.setSecond(date, 5);

          expect(
            generateConfig.locale.format('en_US', date, 'YYYY-MM-DD HH:mm:ss'),
          ).toEqual('2020-10-23 02:03:05');
        });

        it('add', () => {
          let date = generateConfig.getNow();
          date = generateConfig.addYear(date, 2);
          date = generateConfig.addMonth(date, 2);
          date = generateConfig.addDate(date, 2);
          expect(
            generateConfig.locale.format('en_US', date, 'YYYY-MM-DD'),
          ).toEqual('1992-11-05');
        });

        it('isAfter', () => {
          const now = generateConfig.getNow();
          const prev = generateConfig.addDate(now, -1);
          const next = generateConfig.addDate(now, 1);
          expect(generateConfig.isAfter(now, prev)).toBeTruthy();
          expect(generateConfig.isAfter(next, now)).toBeTruthy();
        });

        it('isValidate', () => {
          expect(
            generateConfig.isValidate(generateConfig.getNow()),
          ).toBeTruthy();
        });

        describe('locale', () => {
          it('parse', () => {
            ['2000-01-02', '02/01/2000'].forEach(str => {
              const date = generateConfig.locale.parse('en_US', str, [
                'YYYY-MM-DD',
                'DD/MM/YYYY',
              ]);

              expect(
                generateConfig.locale.format('en_US', date!, 'YYYY-MM-DD'),
              ).toEqual('2000-01-02');
            });
          });

          it('getWeekFirstDay', () => {
            expect(generateConfig.locale.getWeekFirstDay('en_US')).toEqual(0);
            expect(generateConfig.locale.getWeekFirstDay('zh_CN')).toEqual(1);

            // Should keep same weekday
            ['en_US', 'zh_CN'].forEach(() => {
              expect(
                generateConfig.getWeekDay(
                  generateConfig.locale.parse('en_US', '2000-01-01', [
                    'YYYY-MM-DD',
                  ])!,
                ),
              ).toEqual(6);
            });
          });

          it('getWeek', () => {
            expect(
              generateConfig.locale.getWeek(
                'zh_CN',
                generateConfig.locale.parse('zh_CN', '2019-12-08', [
                  'YYYY-MM-DD',
                ])!,
              ),
            ).toEqual(49);
            expect(
              generateConfig.locale.getWeek(
                'en_US',
                generateConfig.locale.parse('en_US', '2019-12-08', [
                  'YYYY-MM-DD',
                ])!,
              ),
            ).toEqual(50);
          });
        });
      });
    },
  );
});