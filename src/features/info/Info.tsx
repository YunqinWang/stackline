import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  getInfo,
  selectProduct,
  selectDescription,
  selectTags,
  selectImg,
} from './infoSlice';
import styles from './Info.module.css';

function getTagList(tags: String[]){
  let tagList: JSX.Element[] =[];
  tags.forEach(tag => {
    tagList.push(<li className={styles.infoTag}>{tag}</li>) ;
  })
  return tagList;
};

export function Info() {
  
  const productName = useAppSelector(selectProduct);
  const productDesc = useAppSelector(selectDescription);
  const productTags =getTagList(useAppSelector(selectTags));
  const productImg = useAppSelector(selectImg);
  
  const dispatch = useAppDispatch();
  dispatch(getInfo());
  

  return (
    <div>
        <div className={styles.infoImg}>
          <img src={productImg}/>
        </div>
        <div className={styles.infoBox}>
          <h4 className={styles.infoName}>{productName}</h4>
          <h5 className={styles.infoDesc}>{productDesc}</h5>
          <ul className={styles.infoTags}>{productTags}</ul>
        </div>
    </div>
  );
}
