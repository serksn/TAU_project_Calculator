import "./Calculator.css";
import Plot from 'react-plotly.js';
import React from 'react';
import { evaluate, complex } from 'mathjs';

const Chart = ({functions, feedbackLoops, L, dt}) => {
    // сделать так чтобы ребята могли использовать это в других частях кода
    dt = parseInt(dt) || 0.001;
    console.log(dt);
    class transferFunctionClass {
        calcFunction({g,dt}) {
        }
        calcFreqResponse({freq=1}) {
            const s = complex(0, freq);
            const H = evaluate(this.transferFunction, { s });
            const amplitude = Math.sqrt(H.re ** 2 + H.im ** 2);
            const phase = Math.atan2(H.im, H.re);
            return [amplitude,phase];
        }
    }

    const ListOfLinks = {
        AperiodicFirstOrder: class extends transferFunctionClass {
            constructor({k=1,T=1}) {
                super();
                this.k=k;
                this.T=T;
                this.z1=0;
                this.w=0;
                this.transferFunction=`(${this.k})/(${this.T}*s+1)`;
                this.y=0;
                this.ypr=0;
            }
            calcFunction({g=1,dt=0.001}) {
                let k1,k2,k3,k4;
                this.ypr = this.y;
                this.y = this.z1;
                k1 = dt * (this.k / this.T * g - this.y / this.T);
                k2 = dt * (this.k / this.T * g - (this.y + k1 / 2) / this.T);
                k3 = dt * (this.k / this.T * g - (this.y + k2 / 2) / this.T);
                k4 = dt * (this.k / this.T * g - (this.y + k3) / this.T);
                this.z1 = this.z1 + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
                return this.y;
            }
        },
        AperiodicSecondOrder: class extends transferFunctionClass {
            constructor({k=1,T1=1,T2=2}) {
                super();
                this.k=k;
                this.T1=T1;
                this.T2=T2;
                this.transferFunction=`(${this.k})/(${this.T1}*s^2+${this.T2}*s+1)`;
                this.z=0;
                this.u=0;
                this.w=0;
                this.y=0;
                this.ypr=0;
            }
            calcFunction({g=1,dt=0.001}) {
                let k1,k2,k3,k4,m1,m2,m3,m4;
                this.ypr = this.y;
                this.y = this.u * this.k / (this.T2 * this.T2);
                k1 = dt * (g - this.T1 / this.T2 / this.T2 * this.z - 1 / this.T2 / this.T2 * this.u);
                m1 = dt * this.z;
                k2 = dt * (g - this.T1 / this.T2 / this.T2 * (this.z + k1 / 2) - 1 / this.T2 / this.T2 * (this.u + m1 / 2));
                m2 = dt * (this.z + k1 / 2);
                k3 = dt * (g - this.T1 / this.T2 / this.T2 * (this.z + k2 / 2) - 1 / this.T2 / this.T2 * (this.u + m2 / 2));
                m3 = dt * (this.z + k2 / 2);
                k4 = dt * (g - this.T1 / this.T2 / this.T2 * (this.z + k3) - 1 / this.T2 / this.T2 * (this.u + m3));
                m4 = dt * (this.z + k3);
                this.z = this.z + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
                this.u = this.u + (m1 + 2 * m2 + 2 * m3 + m4) / 6;
                return this.y;
            }
        },
        Vibrational: class extends transferFunctionClass {
            constructor({k=1,T=1,zeta=0.1}) {
                super();
                this.k=k;
                this.T=T;
                this.zeta=zeta;
                this.transferFunction=`(${this.k})/(${this.T}*s^2+${this.T}*${this.zeta}*s+1)`;
                this.z11=0;
                this.z21=0;
                this.w=0;
                this.y=0;
                this.ypr=0;
            }
            calcFunction({g=1,dt=0.001}) {
                let k1,k2,k3,k4,m1,m2,m3,m4;
                this.ypr = this.y;
                this.y = this.z11;
                k1 = this.z21 * dt;
                m1 = (((this.k * g) / (this.T * this.T)) - (this.z11 / (this.T * this.T)) - ((2 * this.zeta) / this.T) * this.z21) * dt;
                k2 = (this.z21 + (m1 / 2)) * dt;
                m2 = (((this.k * g) / (this.T * this.T)) - ((this.z11 + (k1 / 2)) / (this.T * this.T)) - ((2 * this.zeta) / this.T) * (this.z21 + (m1 / 2))) * dt;
                k3 = (this.z21 + (m2 / 2)) * dt;
                m3 = (((this.k * g) / (this.T * this.T)) - ((this.z11 + (k2 / 2)) / (this.T * this.T)) - ((2 * this.zeta) / this.T) * (this.z21 + (m2 / 2))) * dt;
                k4 = (this.z21 + m3) * dt;
                m4 = (((this.k * g) / (this.T * this.T)) - ((this.z11 + k3) / (this.T * this.T)) - ((2 * this.zeta) / this.T) * (this.z21 + m3)) * dt;
                this.z11 = this.z11 + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
                this.z21 = this.z21 + (m1 + 2 * m2 + 2 * m3 + m4) / 6;
                return this.y;
            }
        },
        Conservateur: class extends transferFunctionClass {
            constructor({k=1,T=1}) {
                super();
                this.k=k;
                this.T=T;
                this.transferFunction=`(${this.k})/(${this.T}*s^2+1)`;
                this.z=0;
                this.u=0;
                this.w=0;
                this.y=0;
                this.ypr=0;
            }
            calcFunction({g=1,dt=0.001}) {
                let k1,k2,k3,k4,m1,m2,m3,m4;
                this.ypr = this.y;
                this.y=this.u*this.k/(this.T*this.T);
                k1 = dt*(g - this.u/(this.T*this.T));
                m1 = dt*(this.z);
                k2 = dt*(g - (this.u+(m1/2))/(this.T*this.T));
                m2 = dt*(this.z + (k1/2));
                k3 = dt*(g - (this.u+(m2/2))/(this.T*this.T));
                m3 = dt*(this.z + (k2/2));
                k4 = dt*(g - (this.u+m3)/(this.T*this.T));
                m4 = dt*(this.z + k3);
                this.z=this.z+(k1 + 2*k2 + 2*k3 + k4)/6;
                this.u=this.u+(m1 + 2*m2 + 2*m3 + m4)/6;
                return this.y;
            }
        },
        DifferentiatingInertial: class extends transferFunctionClass {
            constructor({k=1,T=1}) {
                super();
                this.k=k;
                this.T=T;
                this.transferFunction=`(${this.k}*s)/(${this.T}*s+1)`;
                this.z1=0;
                this.w=0;
                this.y=0;
                this.ypr=0;
            }
            calcFunction({g=1,dt=0.001}) {
                let k1,k2,k3,k4;
                this.ypr = this.y;
                this.y = this.z1+this.k/this.T*g;
                k1 = dt*(-1/this.T*this.y);
                k2 = dt*(-1/this.T*this.y);
                k3 = dt*(-1/this.T*this.y);
                k4 = dt*(-1/this.T*this.y);
                this.z1=this.z1+(k1 + 2*k2 + 2*k3 + k4)/6;
                return this.y;
            }
        },
        InterialForcing: class extends transferFunctionClass {
            constructor({k=1,T1=1,T2=2}) {
                super();
                this.k=k;
                this.T1=T1;
                this.T2=T2;
                this.transferFunction=`${this.k}*(${this.T1}*s+1)/(${this.T2}*s+1)`;
                this.u=0;
                this.w=0;
                this.y=0;
                this.ypr=0;
            }
            calcFunction({g=1,dt=0.001}) {
                let k1,k2,k3,k4;
                this.ypr = this.y;
                this.y=this.k*this.T1/this.T2*(g-1/this.T2*this.u)+this.k/this.T2*this.u;
                k1=dt*(g-1/this.T2*this.u);
                k2=dt*(g-1/this.T2*(this.u+k1/2));
                k3=dt*(g-1/this.T2*(this.u+k2/2));
                k4=dt*(g-1/this.T2*(this.u+k3));
                this.u=this.u+(k1+2*k2+2*k3+k4)/6;
                return this.y;
            }
        },
        nonMinimalPhase: class extends transferFunctionClass {
            constructor({k=1,T1=1,T2=2}) {
                super();
                this.k=k;
                this.T1=T1;
                this.T2=T2;
                this.transferFunction=`${this.k}*(1-${this.T1}*s)/(${this.T2}*s+1)`;
                this.u=0;
                this.w=0;
                this.y=0;
                this.ypr=0;
            }
            calcFunction({g=1,dt=0.001}) {
                let k1,k2,k3,k4;
                this.ypr = this.y;
                this.y=-1*this.k*this.T1/this.T2*(g-1/this.T2*this.u)+this.k/this.T2*this.u;
                k1=dt*(g-1/this.T2*this.u);
                k2=dt*(g-1/this.T2*(this.u+k1/2));
                k3=dt*(g-1/this.T2*(this.u+k2/2));
                k4=dt*(g-1/this.T2*(this.u+k3));
                this.u=this.u+(k1+2*k2+2*k3+k4)/6;
                return this.y;
            }
        },
        Isodromic: class extends transferFunctionClass {
            constructor({k=1,T=1}) {
                super();
                this.k=k;
                this.T=T;
                this.transferFunction=`${this.k}*(${this.T}*s+1)/(s)`;
                this.z1=0;
                this.w=0;
                this.y=0;
                this.ypr=0;
            }
            calcFunction({g=1,dt=0.001}) {
                let k1,k2,k3,k4;
                this.ypr = this.y;
                this.y = this.z1+this.k*this.T*g;
                k1 = dt*(this.k*g);
                k2 = dt*(this.k*g);
                k3 = dt*(this.k*g);
                k4 = dt*(this.k*g);
                this.z1=this.z1+(k1 + 2*k2 + 2*k3 + k4)/6;
                return this.y;
            }
        },
        IntegratingInertial: class extends transferFunctionClass {
            constructor({k=1,T=1}) {
                super();
                this.k=k;
                this.T=T;
                this.transferFunction=`(${this.k})/(s*(${this.T}*s+1))`;
                this.z=0;
                this.u=0;
                this.w=0;
                this.y=0;
                this.ypr=0;
            }
            calcFunction({g=1,dt=0.001}) {
                let k1,k2,k3,k4,m1,m2,m3,m4;
                this.ypr = this.y;
                this.y=this.k/this.T*this.u;
                k1=this.z*dt;
                m1=(g-1/this.T*this.z)*dt;
                k2=(this.z+k1/2)*dt;
                m2=(g-1/this.T*(this.z+m1/2))*dt;
                k3=(this.z+k2/2)*dt;
                m3=(g-1/this.T*(this.z+m2/2))*dt;
                k4=(this.z+k3)*dt;
                m4=(g-1/this.T*(this.z+m3))*dt;
                this.u=this.u+1/6*(k1+2*k2+2*k3+k4)
                this.z=this.z+1/6*(m1+2*m2+2*m3+m4)   
                return this.y;
            }
        },
        delay: class extends transferFunctionClass {
            constructor({tau=0.5}) {
                super();
                this.tau=tau;
                this.y=0;
                this.j=0;
                this.lagTick=0;
                this.lagArray=[];
            }
            calcFunction({g=1,dt=0.001,t}) {
                if (t>this.tau) {
                    if(this.j>=this.lagArray.length-1) this.j=0;
                    this.j=this.j+1;
                    this.y=this.lagArray[this.j];
                    this.lagArray[this.j]=g;
                }
                else {
                    this.lagArray.push(g);
                }
                return this.y;
            }
            calcFreqResponse({freq=1}) {
                const amplitude = 1;
                const phase = freq*this.tau;
                return [amplitude,phase];
            }
        },
        PID: class extends transferFunctionClass {
            constructor({Kp=0.5,Ki=0.2,Kd=0.1}) {
                super();
                this.Kp=Kp;
                this.Ki=Ki;
                this.Kd=Kd;
                this.transferFunction=`${this.Kp}+1/${this.Ki}*s+${this.Kd}*s`
                this.gpr=0;
                this.sumg=0;
                this.dg=0;
            }
            calcFunction({g=1,dt=0.001}) {
                this.dg=(g-this.gpr)/dt;
                this.sumg=this.sumg+g*dt;
                let exit=this.Kp*g+this.Ki*this.sumg+this.Kd*this.dg;
                this.gpr=g;
                return exit;
            }
        }
    }

    const functionObjects = functions.map(({ params, type }) => new ListOfLinks[type](params));
    const feedbackObjects = feedbackLoops.map(loop =>
        loop.feedbackFunctions.map(({ params, type }) => new ListOfLinks[type](params))
    );

    const calculateFunction = (functionObjects = [], feedbackLoops, feedbackObjects = [], dt, L, g = 1) => {

        console.log(dt);
        console.log(L);
        let array_t = [];
        let array_y = [];
        let array_w = [];
        let t = 0;
        let y = 0, ypr = 0;
        let w = 0;

        console.log(feedbackObjects);

        //console.log(functionObjects);


        const EnterSummator =new Array(functionObjects.length).fill(0);

        //Кароче тут нужно сделать подсчёт суммторов для каждого входа в виде массива signals=[];

        while (t < L) {
            ypr = y;
            let signal = g;
            for (let i = 0; i < functionObjects.length; i++) {
                signal+=EnterSummator[i];
                EnterSummator[i]=0;
                y = functionObjects[i].calcFunction({ g: signal, dt: dt, t: t });
                signal = y;
                feedbackLoops.forEach((loop, index) => {
                    if (i == loop.feedbackStart) {
                        let feedbackSignal = signal;
                        for (let j=0; j<feedbackObjects[index].length; j++) {
                            feedbackSignal = feedbackObjects[index][j].calcFunction({ g: feedbackSignal, dt: dt, t: t });
                        }
                        EnterSummator[loop.feedbackEnd] += loop.sign*feedbackSignal;
                    }
                });
            }

            if (t > 0) {
                w = (y - ypr) / dt;
            }
            array_y.push(y);
            array_t.push(t);
            array_w.push(w);
            t = t + dt;
        }
        return [array_t, array_y, array_w];
    };

    const calculateFrequencyResponse = (functionObjects = [], feedbackObjects = [], feedbackLoops = [], frequencies) => {
        const amplitudes = [];
        const phases = [];
        
        frequencies.forEach(freq => {
            let totalAmplitude = 1;
            let totalPhase = 0;
            const sequenceAmplitudes = [];
            const sequencePhases = [];
    
            for (let i = 0; i < functionObjects.length; i++) {
                const [amplitude, phase] = functionObjects[i].calcFreqResponse({ freq: freq });
                sequenceAmplitudes.push(amplitude);
                sequencePhases.push(phase);
            }
    
            feedbackLoops.forEach((loop, loopIndex) => {
                let openLoopAmplitude = 1;
                let openLoopPhase = 0;
    
                for (let j = loop.feedbackEnd; j <= loop.feedbackStart; j++) {
                    openLoopAmplitude *= sequenceAmplitudes[j];
                    openLoopPhase += sequencePhases[j];
                }
    
                let feedbackAmplitude = 1;
                let feedbackPhase = 0;
                feedbackObjects[loopIndex].forEach(feedbackFunction => {
                    const [fbAmplitude, fbPhase] = feedbackFunction.calcFreqResponse({ freq: freq });
                    feedbackAmplitude *= fbAmplitude;
                    feedbackPhase += fbPhase;
                });
    
                const closedLoopAmplitude = openLoopAmplitude / Math.sqrt(1 + Math.pow(feedbackAmplitude * openLoopAmplitude, 2));
                const closedLoopPhase = openLoopPhase - Math.atan2(
                    -1*loop.sign * openLoopAmplitude * feedbackAmplitude * Math.sin(openLoopPhase - feedbackPhase),
                    1 + -1*loop.sign * openLoopAmplitude * feedbackAmplitude * Math.cos(openLoopPhase - feedbackPhase)
                );
    
                totalAmplitude *= closedLoopAmplitude;
                totalPhase += closedLoopPhase;
            });
    
            if (feedbackLoops.length === 0) {
                sequenceAmplitudes.forEach(amplitude => totalAmplitude *= amplitude);
                sequencePhases.forEach(phase => totalPhase += phase);
            }
    
            amplitudes.push(totalAmplitude);
            phases.push(totalPhase);
        });
    
        return [amplitudes, phases];
    };

    const [t, y, w] = calculateFunction(functionObjects, feedbackLoops, feedbackObjects, dt, L);

    const frequencies = Array.from({ length: 1001 }, (_, i) => 0 + i * 0.01);
    const [amplitudes, phases] = calculateFrequencyResponse(functionObjects, feedbackObjects, feedbackLoops, frequencies);
    //console.log(amplitudes, phases);

    return (
        <div className="charts">
            <Plot
                data={[
                    {
                        name: 'Переходная характеристика',
                        x: t,
                        y: y,
                        type: 'scatter',
                        mode: 'lines',
                        marker: { color: 'red' },
                    },
                    {
                        name: 'Весовая характеристика',
                        x: t,
                        y: w,
                        type: 'scatter',
                        mode: 'lines',
                        marker: { color: 'blue' },
                    },
                ]}
                layout={{
                    width: 1024,
                    height: 640,
                    title: 'Временные характеристики объекта',
                    xaxis: {
                        title: {
                            text: 't',
                            font: {
                                family: 'Courier New, monospace',
                                size: 18,
                            }
                        },
                    }
                }}
            />
            <Plot
                data={[
                    {
                        name: 'Амплитудно-частотная характеристика',
                        x: frequencies,
                        y: amplitudes,
                        type: 'scatter',
                        mode: 'lines',
                        marker: { color: 'red' },
                    },
                ]}
                layout={{
                    width: 1024,
                    height: 640,
                    title: 'Амплитудно-частотная характеристика',
                    xaxis: {
                        title: {
                            text: 'omega',
                            font: {
                                family: 'Courier New, monospace',
                                size: 18,
                            }
                        },
                    }
                }}
            />
            <Plot
                data={[
                    {
                        name: 'Фазо-частотная характеристика',
                        x: frequencies,
                        y: phases,
                        type: 'scatter',
                        mode: 'lines',
                        marker: { color: 'blue' },
                    },
                ]}
                layout={{
                    width: 1024,
                    height: 640,
                    title: 'Фазо-частотная характеристика',
                    xaxis: {
                        title: {
                            text: 'omega',
                            font: {
                                family: 'Courier New, monospace',
                                size: 18,
                            }
                        },
                    }
                }}
            />
        </div>
    );
}

export default Chart;