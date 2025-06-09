import { type ThongBao } from '@/services/ThongBao/typing';
import { Avatar, List, Skeleton } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useModel } from 'umi';
import styles from './NoticeList.less';
import { LikeOutlined, CommentOutlined, GiftOutlined, StarOutlined, BellOutlined } from '@ant-design/icons';

export type NoticeIconTabProps = {
	count?: number;
	showClear?: boolean;
	showViewMore?: boolean;
	style?: React.CSSProperties;
	title: string;
	tabKey: string;
	onClick?: (item: ThongBao.IRecord) => void;
	onClear?: () => void;
	emptyText?: string;
	clearText?: string;
	viewMoreText?: string;
	list: ThongBao.IRecord[];
	onViewMore?: () => void;
};

const getTypeInfo = (type?: string) => {
	switch (type) {
		case 'auto_points_like':
			return { icon: <LikeOutlined style={{ color: '#1890ff' }} />, label: 'Điểm năng nổ (Like)' };
		case 'auto_points_comment':
			return { icon: <CommentOutlined style={{ color: '#52c41a' }} />, label: 'Điểm năng nổ (Comment)' };
		case 'like':
			return { icon: <LikeOutlined style={{ color: '#faad14' }} />, label: 'Có người like bài viết' };
		case 'comment':
			return { icon: <CommentOutlined style={{ color: '#eb2f96' }} />, label: 'Có người bình luận' };
		case 'gift':
			return { icon: <GiftOutlined style={{ color: '#722ed1' }} />, label: 'Đổi quà thành công' };
		default:
			return { icon: <BellOutlined style={{ color: '#bfbfbf' }} />, label: 'Thông báo' };
	}
};

const NoticeList: React.FC<NoticeIconTabProps> = ({
	list = [],
	onClick,
	onClear,
	onViewMore,
	emptyText,
	showClear = true,
	clearText,
	viewMoreText,
	showViewMore = false,
}) => {
	const { total, readNotificationModel } = useModel('thongbao.noticeicon');

	if (!list || list.length === 0) {
		return (
			<div className={styles.notFound}>
				<img src='https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg' alt='not found' />
				<div>{emptyText}</div>
			</div>
		);
	}

	const onItemClick = (item: ThongBao.IRecord) => {
		if (!item.read) readNotificationModel('ONE', item?._id);
		onClick?.(item);
	};

	return (
		<div>
			{/* <Scrollbars
        // autoHide
        // ref="scrollbars"
        id="scrollableDiv"
        style={{ height: '400px' }}
      > */}
			<div
				id='scrollableDiv'
				style={{
					height: 400,
					overflow: 'auto',
				}}
			>
				<InfiniteScroll
					style={{ overflow: 'unset' }}
					dataLength={list.length}
					next={() => onViewMore?.()}
					hasMore={list.length < total}
					loader={
						<div style={{ padding: '12px 24px' }}>
							<Skeleton paragraph={{ rows: 1 }} active />
						</div>
					}
					scrollableTarget='scrollableDiv'
				>
					<List<ThongBao.IRecord>
						className={styles.list}
						dataSource={list}
						renderItem={(item) => {
							const itemCls = classNames(styles.item, { [styles.read]: !item.read });
							const leftIcon = item.imageUrl ? <Avatar className={styles.avatar} src={item.imageUrl} /> : null;
							const { icon, label } = getTypeInfo(item.type);

							return (
								<List.Item className={itemCls} key={item._id} onClick={() => onItemClick(item)}>
									<List.Item.Meta
										className={styles.meta}
										avatar={leftIcon || icon}
										title={
											<div className={styles.title}>
												{item.title || label}
												{/* <div className={styles.extra}>{item.extra}</div> */}
											</div>
										}
										description={
											<>
												<div className={styles.description}>{item.description || item.message || label}</div>
												<div className={styles.datetime}>{moment(item.createdAt).fromNow()}</div>
											</>
										}
									/>
								</List.Item>
							);
						}}
					/>
				</InfiniteScroll>
				{/* </Scrollbars> */}
			</div>

			{showClear || showViewMore ? (
				<div className={styles.bottomBar}>
					{showClear ? <div onClick={onClear}>{clearText}</div> : null}
					{showViewMore ? <div onClick={() => onViewMore?.()}>{viewMoreText}</div> : null}
				</div>
			) : null}
		</div>
	);
};

export default NoticeList;
