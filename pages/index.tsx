import React, { useContext } from 'react'
import Router from 'next/router'
import { GetServerSideProps } from 'next'
import { FeatureCollection } from 'geojson'
import { GlobalContext } from '@component/GlobalContext'
import { getLocation, getRegionsGeoJson } from '@api'

import { PrimaryBtn, SecondaryBtn } from '@component/Button'
import { NavigationArrow } from 'phosphor-react'

import styles from '../styles/index.module.sass'
import { motion } from 'framer-motion'
import Link from 'next/link'

const Index = () => {

	const [globalContext, dispatch] = useContext(GlobalContext)

	const onGetLocation = () => {
		getLocation(null, dispatch, Router)
	}

	const chv = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 }
	}

	return (
		<motion.div className={styles.wrapper}>
			<motion.div className={styles.mainContent} >
				<img src='/logo.svg' />
				<span>Cosa puoi fare nella tua regione?</span>
			</motion.div>
			<motion.div
				className={styles.actionContainer}
				variants={chv}
				initial='initial'
				animate='animate'
				exit='exit'
			>
				<PrimaryBtn onClick={onGetLocation}>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<span className={styles.label} >Usa la mia posizione</span>
						<NavigationArrow
							size={24}
							weight='fill'
							mirrored={true}
							style={{ alignSelf: 'center' }} />
					</div>
				</PrimaryBtn>
				<SecondaryBtn>
					<Link href='/italia' key={2}>
						Tutte le regioni
					</Link>
				</SecondaryBtn>
			</motion.div>
		</motion.div>
	)



}

export default Index

// ————————————————————————————————————————————————————————————————————————————

// export const getServerSideProps: GetServerSideProps = async () => {
// 	const regions = await getRegionsGeoJson()
// 	return {
// 		props: {
// 			regions
// 		}
// 	}
// }
