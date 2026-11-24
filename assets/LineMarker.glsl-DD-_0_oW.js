import{KT as ee,Md as te,Me as ie,KU as re,Mf as ae,Mg as se,KY as o,M3 as oe,Mh as ne,L$ as le,KX as g,Mi as ce,Mj as pe,Ly as E,KW as de,KZ as he,K_ as ue,Mk as ve,LU as me,L0 as fe,Ml as R,Mm as D,Mn as ge,Mo as Se,Lz as Pe,Mp as ye,Mq as ze,gs as be,L2 as xe,jU as _e,L3 as $e,_ as we,L4 as O,Mr as Me,L5 as K,L6 as Le,L7 as q,L8 as A,M5 as ke,La as Te,Lc as We,Ms as Oe,Mt as I,Mu as B,Mv as Ce,Mw as Ae,Mx as Ve,a7 as _,aa as Fe,My as je,Le as w,Mz as Ne,Lg as V,LE as Ue,MA as H,ve as Ee,Ma as Re,Lh as De,d6 as Y,kH as Ke,go as G,B as X,MB as qe}from"./index-Z_o9v4Jf.js";function Z(t){let e=new ee,{draped:r,worldSpace:i,anchor:S,hasTip:m,shadingEnabled:C}=t,u=!r&&!i;e.attributes.add("position","vec3"),e.attributes.add(t.hasVVSize?"sizeFeatureAttribute":"size","float"),t.hasVVOpacity&&e.attributes.add("opacityFeatureAttribute","float"),e.attributes.add(t.hasVVColor?"colorFeatureAttribute":"color",t.hasVVColor?"float":"vec4"),e.vertex.inputs.add("position",()=>"position"),t.hasVVSize?e.vertex.inputs.add("sizeFeatureAttribute",()=>"sizeFeatureAttribute"):e.vertex.inputs.add("size",()=>"size"),t.hasVVOpacity&&e.vertex.inputs.add("opacityFeatureAttribute",()=>"opacityFeatureAttribute"),t.hasVVColor?e.vertex.inputs.add("colorFeatureAttribute",()=>"colorFeatureAttribute"):e.vertex.inputs.add("color",()=>"color"),e.include(te,t),e.include(ie,t);let{vertex:a,fragment:l,varyings:v}=e;re(a,t),e.attributes.add("previousDelta","vec4"),e.attributes.add("uv0","vec2"),v.add("vColor","vec4"),v.add("vpos","vec3",{invariant:!0}),v.add("vUV","vec2"),v.add("vSize","float"),m&&v.add("vLineWidth","float"),a.uniforms.add(ae,se).code.add(o`vec4 projectAndScale(vec4 pos) {
vec4 posNdc = proj * pos;
posNdc.xy *= viewport.zw / posNdc.w;
return posNdc;
}`),a.code.add(o`void clip(vec4 pos, inout vec4 prev) {
float vnp = nearFar[0] * 0.99;
if (prev.z > -nearFar[0]) {
float interpolation = (-vnp - pos.z) / (prev.z - pos.z);
prev = mix(pos, prev, interpolation);
}
}`),i?(e.attributes.add("normal","vec3"),a.constants.add("tiltThreshold","float",.7).uniforms.add(oe).code.add(o`vec3 perpendicular(vec3 v) {
vec3 n = (viewNormal * vec4(normal.xyz, 1.0)).xyz;
vec3 n2 = cross(v, n);
vec3 forward = vec3(0.0, 0.0, 1.0);
float tiltDot = dot(forward, n);
return abs(tiltDot) < tiltThreshold ? n : n2;
}`)):a.code.add(o`vec2 perpendicular(vec2 v) {
return vec2(v.y, -v.x);
}`);let c=i?"vec3":"vec2";return a.code.add(o`
    ${c} normalizedSegment(${c} pos, ${c} prev) {
      ${c} segment = pos - prev;
      float segmentLen = length(segment);

      // normalize or zero if too short
      return (segmentLen > 0.001) ? segment / segmentLen : ${i?"vec3(0.0, 0.0, 0.0)":"vec2(0.0, 0.0)"};
    }

    ${c} displace(${c} pos, ${c} prev, float displacementLen) {
      ${c} segment = normalizedSegment(pos, prev);

      ${c} displacementDirU = perpendicular(segment);
      ${c} displacementDirV = segment;

      ${S===1?"pos -= 0.5 * displacementLen * displacementDirV;":""}

      return pos + displacementLen * (uv0.x * displacementDirU + uv0.y * displacementDirV);
    }
  `),u&&(a.uniforms.add(ne),a.code.add(o`vec3 inverseProject(vec4 posScreen) {
posScreen.xy = (posScreen.xy / viewport.zw) * posScreen.w;
return (inverseProjectionMatrix * posScreen).xyz;
}`),a.code.add(o`bool rayIntersectPlane(vec3 rayDir, vec3 planeOrigin, vec3 planeNormal, out vec3 intersection) {
float cos = dot(rayDir, planeNormal);
float t = dot(planeOrigin, planeNormal) / cos;
intersection = t * rayDir;
return abs(cos) > 0.001 && t > 0.0;
}`),a.uniforms.add(le),a.code.add(o`
      vec4 toFront(vec4 displacedPosScreen, vec3 posLeft, vec3 posRight, vec3 prev, float lineWidth) {
        // Project displaced position back to camera space
        vec3 displacedPos = inverseProject(displacedPosScreen);

        // Calculate the plane that we want the marker to lie in. Note that this will always be an approximation since ribbon lines are generally
        // not planar and we do not know the actual position of the displaced prev vertices (they are offset in screen space, too).
        vec3 planeNormal = normalize(cross(posLeft - posRight, posLeft - prev));
        vec3 planeOrigin = posLeft;

        ${g(t.hasCap,`if(prev.z > posLeft.z) {
                vec2 diff = posLeft.xy - posRight.xy;
                planeOrigin.xy += perpendicular(diff) / 2.0;
             }`)};

        // Move the plane towards the camera by a margin dependent on the line width (approximated in world space). This tolerance corrects for the
        // non-planarity in most cases, but sharp joins can place the prev vertices at arbitrary positions so markers can still clip.
        float offset = lineWidth * screenPixelSizePerDistance;
        planeOrigin *= (1.0 - offset);

        // Intersect camera ray with the plane and make sure it is within clip space
        vec3 rayDir = normalize(displacedPos);
        vec3 intersection;
        if (rayIntersectPlane(rayDir, planeOrigin, planeNormal, intersection) && intersection.z < -nearFar[0] && intersection.z > -nearFar[1]) {
          return vec4(intersection.xyz, 1.0);
        }

        // Fallback: use depth of pos or prev, whichever is closer to the camera
        float minDepth = planeOrigin.z > prev.z ? length(planeOrigin) : length(prev);
        displacedPos *= minDepth / length(displacedPos);
        return vec4(displacedPos.xyz, 1.0);
      }
  `)),ce(a),e.include(pe),a.main.add(o`
    // Check for special value of uv0.y which is used by the Renderer when graphics are removed before the VBO is
    // recompacted. If this is the case, then we just project outside of clip space.
    if (uv0.y == 0.0) {
      // Project out of clip space
      gl_Position = ${E};
      return;
    }

    vec4 pos  = view * vec4(position, 1.0);
    vec4 prev = view * vec4(position + previousDelta.xyz * previousDelta.w, 1.0);

    float lineWidth = getLineWidth(${g(t.lineWidthRequiresPosition,"pos.xyz")});
    float screenMarkerSize = getScreenMarkerSize(lineWidth);

    clip(pos, prev);

    ${i?o`${g(t.hideOnShortSegments,o`
              if (areWorldMarkersHidden(pos.xyz, prev.xyz)) {
                gl_Position = ${E};
                return;
              }`)}
          pos.xyz = displace(pos.xyz, prev.xyz, getWorldMarkerSize(pos.xyz));
          vec4 displacedPosScreen = projectAndScale(pos);`:o`
          vec4 posScreen = projectAndScale(pos);
          vec4 prevScreen = projectAndScale(prev);
          vec4 displacedPosScreen = posScreen;

          displacedPosScreen.xy = displace(posScreen.xy, prevScreen.xy, screenMarkerSize);
          ${g(u,o`
              vec2 displacementDirU = perpendicular(normalizedSegment(posScreen.xy, prevScreen.xy));

              // We need three points of the ribbon line in camera space to calculate the plane it lies in
              // Note that we approximate the third point, since we have no information about the join around prev
              vec3 lineRight = inverseProject(posScreen + lineWidth * vec4(displacementDirU.xy, 0.0, 0.0));
              vec3 lineLeft = pos.xyz + (pos.xyz - lineRight);

              pos = toFront(displacedPosScreen, lineLeft, lineRight, prev.xyz, lineWidth);
              displacedPosScreen = projectAndScale(pos);
            `)}`}
    // Convert back into NDC
    displacedPosScreen.xy = (displacedPosScreen.xy / viewport.zw) * displacedPosScreen.w;

    // Convert texture coordinate into [0,1]
    vUV = (uv0 + 1.0) / 2.0;
    ${g(!i,"vUV = noPerspectiveWrite(vUV, displacedPosScreen.w);")}
    ${g(m,"vLineWidth = noPerspectiveWrite(lineWidth, displacedPosScreen.w);")}

    vSize = screenMarkerSize;
    vColor = getColor();

    // Use camera space for slicing
    vpos = pos.xyz;

    gl_Position = displacedPosScreen;
  `),l.include(de,t),e.include(he,t),l.include(ue),l.include(ve),l.uniforms.add(new me("intrinsicColor",({color:y})=>y),new fe("tex",({markerTexture:y})=>y)).constants.add("texelSize","float",1/R).code.add(o`float markerAlpha(vec2 samplePos) {
samplePos += vec2(0.5, -0.5) * texelSize;
float sdf = texture(tex, samplePos).r;
float pixelDistance = sdf * vSize;
pixelDistance -= 0.5;
return clamp(0.5 - pixelDistance, 0.0, 1.0);
}`),m&&(e.include(D),l.constants.add("relativeMarkerSize","float",ge/R).constants.add("relativeTipLineWidth","float",Se).code.add(o`
        float tipAlpha(vec2 samplePos) {
          // Convert coordinates s.t. they are in pixels and relative to the tip of an arrow marker
          samplePos -= vec2(0.5, 0.5 + 0.5 * relativeMarkerSize);
          samplePos *= vSize;

          float halfMarkerSize = 0.5 * relativeMarkerSize * vSize;
          float halfTipLineWidth = 0.5 * max(1.0, relativeTipLineWidth * noPerspectiveRead(vLineWidth));

          ${g(i,"halfTipLineWidth *= fwidth(samplePos.y);")}

          float distance = max(abs(samplePos.x) - halfMarkerSize, abs(samplePos.y) - halfTipLineWidth);
          return clamp(0.5 - distance, 0.0, 1.0);
        }
      `)),e.include(Pe,t),e.include(D),l.main.add(o`
    discardBySlice(vpos);

    vec4 albedo = intrinsicColor * vColor;

    // Cancel out perspective correct interpolation if in screen space or draped
    vec2 samplePos = ${g(i,"vUV","noPerspectiveRead(vUV)")};
    albedo.a *= ${m?"max(markerAlpha(samplePos), tipAlpha(samplePos))":"markerAlpha(samplePos)"};
    if(albedo.a < alphaCutoff) discard; // We also want to discard in the opaque color pass
  `),C?(v.add("vnormal","vec3"),a.include(ye,t),a.main.add("vnormal = getLocalUp(vpos, localOrigin);"),e.include(ze,t),l.main.add("vec4 finalColor = evaluateSceneLightingFragment(vpos, vnormal, albedo);")):l.main.add("vec4 finalColor = albedo;"),l.main.add("outputColorHighlightOLID(applySlice(finalColor, vpos), albedo.rgb);"),e}const Ie=Object.freeze(Object.defineProperty({__proto__:null,build:Z},Symbol.toStringTag,{value:"Module"}));let F=class extends xe{constructor(t,e){super(t,e,_e(J(e))),this.shader=new $e(Ie,()=>we(()=>Promise.resolve().then(()=>Ze),void 0))}_makePipelineState(t,e){let{output:r,draped:i,hasOccludees:S}=t;return O({blending:We(r,!1,t.emissionDimmingPass),depthTest:i?null:Te(r),depthWrite:ke(t),colorWrite:A,stencilWrite:S?q:null,stencilTest:S?e?K:Le:null,polygonOffset:Me})}initializePipeline(t){return t.occluder?(this._occluderPipelineTransparent=O({blending:B,depthTest:I,depthWrite:null,colorWrite:A,stencilWrite:null,stencilTest:Oe}),this._occluderPipelineOpaque=O({blending:B,depthTest:I,depthWrite:null,colorWrite:A,stencilWrite:Ae,stencilTest:Ce}),this._occluderPipelineMaskWrite=O({blending:null,depthTest:Ve,depthWrite:null,colorWrite:null,stencilWrite:q,stencilTest:K})):this._occluderPipelineTransparent=this._occluderPipelineOpaque=this._occluderPipelineMaskWrite=null,this._occludeePipelineState=this._makePipelineState(t,!0),this._makePipelineState(t,!1)}getPipeline(t,e,r){return r?this._occludeePipelineState:t.occluder===11?this._occluderPipelineTransparent??super.getPipeline(t,e,r):t.occluder===10?this._occluderPipelineOpaque??super.getPipeline(t,e,r):this._occluderPipelineMaskWrite??super.getPipeline(t,e,r)}};F=_([Fe("esri.views.3d.webgl-engine.shaders.LineMarkerTechnique")],F);function J(t){let e=be().vec3f("position").vec4f16("previousDelta").vec2f16("uv0");return t.hasVVColor?e.f32("colorFeatureAttribute"):e.vec4u8("color",{glNormalized:!0}),t.hasVVOpacity&&e.f32("opacityFeatureAttribute"),t.hasVVSize?e.f32("sizeFeatureAttribute"):e.f16("size"),t.worldSpace&&e.vec3f16("normal"),e.freeze()}class $ extends je{constructor(){super(...arguments),this.anchor=0,this.worldSpace=!1,this.hideOnShortSegments=!1,this.hasCap=!1,this.hasTip=!1,this.occlusionPass=!1,this.olidColorInstanced=!1}}_([w({count:2})],$.prototype,"anchor",void 0),_([w()],$.prototype,"worldSpace",void 0),_([w()],$.prototype,"hideOnShortSegments",void 0),_([w()],$.prototype,"hasCap",void 0),_([w()],$.prototype,"hasTip",void 0);class Qe extends Ne{constructor(e,r){super(e,He),this.produces=new Map([[2,i=>i===10||V(i)&&this.parameters.renderOccluded===8],[3,i=>Ue(i)],[10,i=>H(i)&&this.parameters.renderOccluded===8],[11,i=>H(i)&&this.parameters.renderOccluded===8],[4,i=>V(i)],[18,i=>V(i)||i===10]]),this.intersectRayDraped=void 0,this.intersectScreenPolygonDraped=void 0,this._configuration=new $(r)}updateConfiguration(e){super.updateConfiguration(e),this._configuration.hideOnShortSegments=this.parameters.hideOnShortSegments,this._configuration.hasCap=this.parameters.cap!==0,this._configuration.anchor=this.parameters.anchor,this._configuration.hasTip=this.parameters.hasTip,this._configuration.hasSlicePlane=this.parameters.hasSlicePlane,this._configuration.worldSpace=this.parameters.worldSpace&&!this._configuration.draped,this._configuration.hasScreenSizePerspective=this.parameters.screenSizePerspective!=null&&!this._configuration.worldSized}get visible(){return this.parameters.color[3]>=Ee}get emissions(){return this.parameters.emissiveStrength>0?this.parameters.renderOccluded===8?1:2:0}intersectRay(){}intersectScreenPolygon(){return null}createBufferWriter(){return new Ye(J(this.parameters),this.parameters)}createGLMaterial(e){return new Be(e)}}class Be extends De{dispose(){super.dispose(),this._markerTextures?.release(this._markerPrimitive),this._markerPrimitive=null}beginSlot(e){let r=this._material.parameters.markerPrimitive;return r!==this._markerPrimitive&&(this._material.setParameters({markerTexture:this._markerTextures.swap(r,this._markerPrimitive)}),this._markerPrimitive=r),this.getTechnique(F,e)}}class He extends Re{constructor(){super(...arguments),this.width=0,this.color=[1,1,1,1],this.markerPrimitive="arrow",this.markerScale=1,this.placement="end",this.cap=0,this.anchor=0,this.hasTip=!1,this.shadingEnabled=!1,this.worldSpace=!1,this.worldSized=!1,this.hideOnShortSegments=!1,this.hasSlicePlane=!1,this.vvFastUpdate=!1,this.stipplePattern=null,this.markerTexture=null}}class Ye{constructor(e,r){this.layout=e,this._parameters=r}elementCount(){return this._parameters.placement==="begin-end"?12:6}write(e,r,i,S){if(S==null)return;let{buffer:m,offset:C}=S,u=i.get("position").data,a=u.length/3,l=[1,0,0],v=i.get("normal");this._parameters.worldSpace&&v!=null&&(l=v.data);let c=1,y=0;this._parameters.vvSize?y=i.get("sizeFeatureAttribute").data[0]:i.has("size")&&(c=i.get("size").data[0]);let z=[1,1,1,1],j=0;this._parameters.vvColor?j=i.get("colorFeatureAttribute").data[0]:i.has("color")&&(z=i.get("color").data);let N=0;this._parameters.vvOpacity&&(N=i.get("opacityFeatureAttribute").data[0]);let P=new Float32Array(m.buffer),f=new Float16Array(m.buffer),M=new Uint8Array(m.buffer),p=C*(this.layout.stride/4),b=P.BYTES_PER_ELEMENT/f.BYTES_PER_ELEMENT,Q=4/b,x=(n,k,d,h)=>{P[p++]=n[0],P[p++]=n[1],P[p++]=n[2],qe(k,n,f,p*b),p+=Q;let s=p*b;if(f[s++]=d[0],f[s++]=d[1],p=Math.ceil(s/b),this._parameters.vvColor)P[p++]=j;else{let T=Math.min(h*4,z.length-4),W=p++*4;M[W]=z[T]*255,M[W+1]=z[T+1]*255,M[W+2]=z[T+2]*255,M[W+3]=z[T+3]*255}this._parameters.vvOpacity&&(P[p++]=N),s=p*b,this._parameters.vvSize?(P[p++]=y,s+=2):f[s++]=c,this._parameters.worldSpace&&(f[s++]=l[0],f[s++]=l[1],f[s++]=l[2]),p=Math.ceil(s/b)},U=(n,k)=>{let d=Y(Ge,u[n*3],u[n*3+1],u[n*3+2]),h=Xe,s=n+k;do Y(h,u[s*3],u[s*3+1],u[s*3+2]),s+=k;while(Ke(d,h)&&s>=0&&s<a);e&&(G(d,d,e),G(h,h,e)),x(d,h,[-1,-1],n),x(d,h,[1,-1],n),x(d,h,[1,1],n),x(d,h,[-1,-1],n),x(d,h,[1,1],n),x(d,h,[-1,1],n)},L=this._parameters.placement;(L==="begin"||L==="begin-end")&&U(0,1),(L==="end"||L==="begin-end")&&U(a-1,-1)}}const Ge=X(),Xe=X(),Ze=Object.freeze(Object.defineProperty({__proto__:null,build:Z},Symbol.toStringTag,{value:"Module"}));export{Qe as h};
