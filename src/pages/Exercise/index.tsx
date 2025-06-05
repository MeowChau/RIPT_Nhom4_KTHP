import { Layout, Row, Col, BackTop } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import SearchBar from './components/SearchBar';
import ExerciseList from './components/ExerciseList';
import ExerciseFilter from './components/ExerciseFilter';
import ExerciseDetail from './components/ExerciseDetail';
import useExercise from '@/models/useExercise';
import styles from '@/pages/Exercise/components/styles.less';

const { Content } = Layout;

export default () => {
  const {
    exercises,
    loading,
    exerciseTypes,
    filterType,
    searchText,
    selectedExercise,
    detailsVisible,
    setFilterType,
    setSearchText,
    fetchExerciseDetails,
    setDetailsVisible,
  } = useExercise();

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <SearchBar
          onSearch={setSearchText}
          onFilter={setFilterType}
          types={exerciseTypes}
        />

        <Row gutter={24} className={styles.mainContent}>
          <Col xs={24} sm={24} md={6} lg={5} xl={4}>
            <ExerciseFilter
              types={exerciseTypes}
              selectedType={filterType}
              onTypeChange={setFilterType}
            />
          </Col>
          <Col xs={24} sm={24} md={18} lg={19} xl={20}>
            <ExerciseList
              exercises={exercises}
              loading={loading}
              onView={fetchExerciseDetails}
              searchText={searchText}
            />
          </Col>
        </Row>

        <ExerciseDetail
          exercise={selectedExercise}
          visible={detailsVisible}
          onClose={() => setDetailsVisible(false)}
        />
      </Content>

      <BackTop>
        <div className={styles.backTopButton}>
          <ArrowUpOutlined />
        </div>
      </BackTop>
    </Layout>
  );
};