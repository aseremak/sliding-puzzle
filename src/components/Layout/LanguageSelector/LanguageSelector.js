import React, { useContext } from 'react';
import Dropdown from '../../UI/Dropdown/Dropdown';
import { txt } from '../../../shared/dict';
import LangContext from '../../../hoc/context/LangContext';

const LanguageSelector = (props) => {
	const 
		langContext = useContext(LangContext),
		currentLang = txt.EN[langContext.lang],
		languages = Object.entries(txt.ENGLISH),
		list = languages.map((lang) => {
			return (
				<li 
					key={lang[0]}
					onClick={ () => {props.langSelect(lang[0])}}
				>
						{lang[1]}
				</li>
			)
	});

	return (
		<Dropdown 
			expanded={props.expanded}
			clickCall={props.clickCall}
			caption={currentLang}>
			{list}
		</Dropdown>
		)
};

export default LanguageSelector;
