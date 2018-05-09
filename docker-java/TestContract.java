package teste;

import org.neo.smartcontract.framework.services.neo.TriggerType;
import org.neo.smartcontract.framework.services.system.ExecutionEngine;

import java.math.BigInteger;

import org.neo.smartcontract.framework.Helper;
import org.neo.smartcontract.framework.SmartContract;
import org.neo.smartcontract.framework.services.neo.Runtime;
import org.neo.smartcontract.framework.services.neo.Storage;
import org.neo.smartcontract.framework.services.neo.Transaction;
import org.neo.smartcontract.framework.services.neo.TransactionOutput;

public class JavaContract extends SmartContract {

	public static Object Main(String operation, Object[] args) {
		TriggerType trigger = Runtime.trigger();

		if (trigger == TriggerType.Verification) {

			return true;

		} else if (trigger == TriggerType.Application) {

			
		}

		return false;
	}

	

}
                            
