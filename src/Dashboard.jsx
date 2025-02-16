import ConnectBox from './ConnectBox';
import RandomizerConfig from './RandomizerConfig';
import { useURL } from './URLContext';

export default function Dashboard() {
    const randomizerURL = useURL();

    return (
	<>
	    <h1>Prospective Randomization Configuration</h1>
	    {(!!randomizerURL) || <ConnectBox/> }
	  {randomizerURL && <RandomizerConfig/> }
	</>
    )
}
