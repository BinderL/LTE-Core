
import React, {useState, useEffect} from 'react';

import Rogue from "../contracts/Rogue.json";
import Tairreux from "../contracts/Tairreux.json";
import WMatic from "../contracts/WMATIC.json";
import UniswapV2Factory from "../contracts/UniswapV2Factory.json";

import StakingSpace from "./StakingSpace";

import {ethers} from "ethers";

import Spinner from "react-bootstrap/Spinner";

const Staking = (props) => {

	const [isReadyToRender, setIsReadyToRender] = useState(false);
	const _provider = props.provider;
	const _networkId = props.network_id;
	var address = window.ethereum.selectedAddress;
	const [staker,setStaker] = useState(false);
  const spinner = <Spinner as="span" animation="border" size="sm" />;


	const [MPs,setMPs] = useState(null);
	const [stMPs, setstMPs] = useState(null);
	const [factory, setFactory] = useState(null);
	const [wmatic, setWmatic] = useState(null);




	const displayStaker = (props) => {
		return(
			<StakingSpace
				provider={props.provider}
				networkId={props.networkId}
				MPs={MPs}
				stMPs={stMPs}
			/>
		)	
	}
	
	useEffect(() => {
		const initialize = async () => {
			const _MPs = new ethers.Contract(
				Rogue.networks[_networkId].address,
				Rogue.abi,
				_provider.getSigner()
			);
			setMPs(_MPs);

			const _stMPs = new ethers.Contract(
				Tairreux.networks[_networkId].address,
				Tairreux.abi,
				_provider.getSigner()
			);
			setstMPs(_stMPs);
		
			const _factory = new ethers.Contract(
				UniswapV2Factory.networks[_networkId].address,
				UniswapV2Factory.abi,
				_provider.getSigner()
			);
			setFactory(_factory);

			const _wmatic = new ethers.Contract(
				WMatic.networks[_networkId].address,
				WMatic.abi,
				_provider.getSigner()
			);
			setWmatic(_wmatic);

			var pairAddr = await _factory.getPair(_wmatic.address, _MPs.address);
		}

	if(_provider && _networkId){
			initialize();
			setIsReadyToRender(true);
		}

	},[_provider,_networkId]);

	if (!isReadyToRender)
    return(<>{spinner}</>)

	if(staker){
		return(displayStaker(props));
	}
	return(
		<input
			onClick={() => {setStaker(true);}}
			type="button"
			value="Staking Space"/>
	)
}

export default Staking;