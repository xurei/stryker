import { fsAsPromised } from '@stryker-mutator/util';
import { expect } from 'chai';
import * as path from 'path';
import { ScoreResult } from 'stryker-api/report';

describe('After running stryker on angular project', () => {
  it('should report 15% mutation score', async () => {
    const eventsDir = path.resolve(__dirname, '..', 'reports', 'mutation', 'events');
    const allReportFiles = await fsAsPromised.readdir(eventsDir);
    const scoreResultReportFile = allReportFiles.find(file => !!file.match(/.*onScoreCalculated.*/));
    expect(scoreResultReportFile).ok;
    const scoreResultContent = await fsAsPromised.readFile(path.resolve(eventsDir, scoreResultReportFile || ''), 'utf8');
    const scoreResult = JSON.parse(scoreResultContent) as ScoreResult;
    expect(scoreResult.killed).eq(2);
    expect(scoreResult.survived).eq(11);
    expect(scoreResult.runtimeErrors).eq(2);

    expect(scoreResult.mutationScore).greaterThan(15).and.lessThan(16);
  });
});
