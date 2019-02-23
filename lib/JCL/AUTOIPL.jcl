//*******************************************************************
//*                                                                    
//* Copyright (c) 2017 IBM Corp.                                     
//* All rights reserved. This program and the accompanying materials 
//* are made available under the terms of the Eclipse Public License 
//* v1.0 which accompanies this distribution, and is available at   
//* http://www.eclipse.org/legal/epl-v10.html                       
//*                                                                 
//* Contributors:                                                   
//*  IBM Corp. - initial API and implementation                     
//*                                                                 
//*******************************************************************
//AUTOIPLW JOB ,'KMINER 407-493-5229 ',CLASS=A,MSGCLASS=X,             
//             MSGLEVEL=(2,0),NOTIFY=&SYSUID                           
/*JOBPARM  S=*                                                         
//*                                                                    
//*--------------------------------------------------------------------
//* Create symbols for the parms to passed to the AUTOIPL task         
//*--------------------------------------------------------------------
//EXPORT1  EXPORT SYMLIST=(IPLVOL,FORCE,TGTSYS)                        
//SETIPL   SET IPLVOL=__VOLSERTYPE__                                              
//SETFORCE SET FORCE=__FORCEBOOLEAN__                                                 
//SETTGT   SET TGTSYS=__SYSTEMNAME__                                      
//*                                                                    
//*--------------------------------------------------------------------
//* Delete the data set or catalog entry for the syslog capture d.s.   
//*--------------------------------------------------------------------
//RESIDUAL EXEC PGM=IDCAMS,REGION=2M                                   
//SYSPRINT DD SYSOUT=*                                                 
//SYSIN    DD *                                                        
  DEL KEMINER.TESTIPL.SYSLOG1                                          
  DEL KEMINER.TESTIPL.SYSLOG1 NSCR                                     
  SET MAXCC EQ 0                                                       
/*                                                                     
//*                                                                    
//*--------------------------------------------------------------------
//* Allocate the data sets to be used to capture syslog data           
//*--------------------------------------------------------------------
//ALLCWORK EXEC PGM=IEFBR14                                            
//ALLOC1    DD DSN=&ISFIN01,DISP=(,PASS,DELETE),                       
//             SPACE=(TRK,(5,5)),UNIT=3390,                            
//             DCB=(RECFM=FB,LRECL=80,BLKSIZE=0,DSORG=PS)              
//*                                                                    
//ALLOC2    DD DISP=(,CATLG,DELETE),DSN=KEMINER.TESTIPL.SYSLOG1,       
//             SPACE=(TRK,(5,5)),UNIT=3390,                            
//             DCB=(RECFM=FB,LRECL=133,BLKSIZE=0,DSORG=PS)             
//*                                                                    
//*                                                                    
//*--------------------------------------------------------------------
//* Set the start of the syslog capture                                
//*--------------------------------------------------------------------
//LOGSTRT  EXEC PGM=SYSLOGC,PARM='KEMINER.TESTIPL.SYSLOG1'             
//SYSABEND  DD SYSOUT=*                                                
//SYSLCDD   DD DISP=(OLD,PASS),DSN=&ISFIN01                            
//*                                                                    
//*                                                                    
//*--------------------------------------------------------------------
//* Place steps that will create syslog data after this point          
//*--------------------------------------------------------------------
//STARTIPL EXEC PGM=IKJEFT1B                                           
//SYSPROC  DD DISP=SHR,DSN=D55TST.TEST.CLIST                           
//SYSTSPRT DD SYSOUT=*                                                 
//SYSPRINT DD SYSOUT=*                                                 
//SYSTSIN  DD *,SYMBOLS=EXECSYS                                        
 %MVSCMD S AUTOIPL,FORCE=&FORCE,SYS=&TGTSYS,IPLVOL=&IPLVOL WAITTIME(2)                         
/*                                                                     
//*                                                                    
//*--------------------------------------------------------------------
//* Check to ensure the AUTOIPL task is running and not already done   
//*--------------------------------------------------------------------
//DISPAUTO EXEC PGM=IKJEFT01                                           
//SYSPROC  DD DISP=SHR,UNIT=3390,VOL=SER=D55SHR,DSN=D55TST.TEST.CLIST  
//SYSTSPRT DD SYSOUT=*                                                 
//SYSPRINT DD DISP=(,PASS),UNIT=3390,SPACE=(TRK,(5,5)),DSN=&CMDOUT,    
//            DCB=(RECFM=FB,LRECL=133,BLKSIZE=0)                       
//SYSTSIN  DD *                                                        
 %MVSCMD D A,AUTOIPL WAITTIME(2)                                       
/*                                                                     
//*                                                                    
//*--------------------------------------------------------------------
//* Copy the D SMF command output to sysout                            
//*--------------------------------------------------------------------
//GENRSTEP EXEC PGM=IEBGENER                                           
//SYSPRINT DD DUMMY                                                    
//SYSIN    DD DUMMY                                                    
//SYSUT1   DD DISP=(OLD,PASS),DSN=&CMDOUT                              
//SYSUT2   DD SYSOUT=*                                                 
//*                                                                    
//*                                                                    
//*--------------------------------------------------------------------
//* Check to see if SYS1.MAN0 is the active SMF data set               
//* Attempting to dump a SMF data set marked as the alternate will     
//* result in a IFA023I INDD0    IS EMPTY, SMF DATA NOT DUMPED         
//*--------------------------------------------------------------------
//CHKAUTO EXEC PGM=ISRSUPC,                                            
//            PARM=(SRCHCMP,'ANYC,FINDALL,NOPRTCC,LONGLN,XREF')        
//NEWDD    DD DISP=SHR,DSN=&CMDOUT                                     
//OUTDD    DD SYSOUT=*                                                 
//SYSIN    DD  *                                                       
  SRCHFOR  'NOT FOUND'                                                 
/*                                                                     
//*                                                                    
//IFNOIPL  IF (CHKAUTO.RC EQ 1) THEN                                   
//*--------------------------------------------------------------------
//* Do not wait for AUTOIPL to end because it is not running           
//*--------------------------------------------------------------------
//NOWAIT  EXEC PGM=IEFBR14                                             
//*                                                                    
// ELSE                                                                
//*                                                                    
//*--------------------------------------------------------------------
//* Wait for the AUTOIPL to end                                        
//* This is possible because the AUTOIPL task itself waits for the     
//* system IPLed to rejoin the sysplex.                                
//*--------------------------------------------------------------------
//WAIT4IPL EXEC PGM=VALKYRIE                                           
//SYSPRINT DD SYSOUT=*                                                 
//SYSIN    DD *                                                        
  Quiet                                                                
  MVSEXPECT $HASP395 AUTOIPL  ENDED                                    
  MVSWAIT                                                              
/*                                                                     
//*                                                                    
//IFNOIPL  ENDIF                                                       
//*                                                                    
//*--------------------------------------------------------------------
//* Finished steps to be in the captured syslog                        
//* Set the end of the syslog capture                                  
//*--------------------------------------------------------------------
//LOGEND   EXEC PGM=SYSLOGC,PARM='COMPLETE'                            
//SYSABEND DD SYSOUT=*                                                 
//SYSLCDD  DD DISP=(OLD,PASS),DSN=&ISFIN01                             
//*                                                                    
//*                                                                    
//*--------------------------------------------------------------------
//* Execute ISFAFD SDSF BATCH to capture data from active SYSLOG       
//*--------------------------------------------------------------------
//COPYLOG  EXEC PGM=ISFAFD,PARM='++24,133'                             
//HASPINDX DD DSN=SYS1.HASPINDX,DISP=SHR                               
//ISFOUT   DD DUMMY                                                    
//ISFIN    DD DISP=(OLD,DELETE),DSN=&ISFIN01                           
//*                                                                    
//*                                                                    
//*--------------------------------------------------------------------
//* Copy test output to sysout                                         
//*--------------------------------------------------------------------
//GENRSLOG EXEC PGM=IEBGENER                                           
//SYSIN    DD DUMMY                                                    
//SYSPRINT DD DUMMY                                                    
//SYSUT1   DD DISP=(OLD,DELETE),DSN=KEMINER.TESTIPL.SYSLOG1            
//SYSUT2   DD SYSOUT=*                                                 
//*                                                                    
//*                                                                    
