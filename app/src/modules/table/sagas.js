import { takeLatest, call, put } from 'redux-saga/effects';

import * as AT from './actions-type';
import * as api from '../../api';
import * as urls from '../../api/urls';
import * as actions from './actions';

function* getStatistics({
  payload: {
    groupBy,
    dateRange,
    platform,
    browser,
    operatingSystem,
    offset,
  }
}) {
  try {
    const statistics = yield call(api.get, {
      url: urls.statUrl({ 
        groupBy, 
        dateRange,
        platform,
        browser,
        operatingSystem,
        offset,
      }),
    });
    
    yield put(actions.getStatisticsSuccess({ statistics }));

    const pageCount = Math.ceil(statistics.count / 25);
    yield put(actions.setPageCount({ pageCount }));

  } catch (errorMessage) {
    yield put(actions.getStatisticsFail({ errorMessage: errorMessage.toString() }));
  }
}

function* watchGetStatistics() {
  yield takeLatest(AT.GET_STATISTICS, getStatistics);
}

const tableSagas = [
  watchGetStatistics,
];

export default tableSagas;
